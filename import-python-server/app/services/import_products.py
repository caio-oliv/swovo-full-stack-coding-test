import io
import csv
from typing import List, Tuple
from werkzeug.datastructures import FileStorage

from .type_parser import ImportStrategy
from .product_parser import parse_product_row
from ..errors.validation import ValidationError, RequestSegment, ValidationIssue
from ..entities.product import Product, ProductBatch
from ..extensions.database import get_db
from ..services.exchange import ExchangeRate


EXPECTED_FIELDS = {"name", "price", "expiration"}

def parse_products_csv_file(file: FileStorage, exchange: ExchangeRate, strategy: ImportStrategy) -> Tuple[ProductBatch, List[Product], List[ValidationIssue]]:
	errors: List[ValidationIssue] = []
	products: List[Product] = []
	batch = ProductBatch.new(file.filename, strategy)

	try:
		# https://docs.python.org/3/library/codecs.html#codec-base-classes
		error_strategy = "strict" if strategy == ImportStrategy.ATOMIC else "replace"
		stream = io.TextIOWrapper(file.stream, encoding="utf-8", errors=error_strategy)
		reader = csv.reader(stream, delimiter=';')
		first_row = next(reader)

		if is_product_csv_header(first_row):
			stream.seek(0)
			dict_reader = csv.DictReader(stream, delimiter=';')
			normalize_csv_fieldnames(dict_reader)
		else:
			stream.seek(0)
			dict_reader = csv.DictReader(stream, delimiter=';', fieldnames=EXPECTED_FIELDS)

		for row_index, row in enumerate(dict_reader, start=1):
			if not any(row.values()):
				continue

			try:
				product = parse_product_row(row, row_index, batch.id, exchange)
				if isinstance(product, ValidationIssue):
					errors.append(product)
				else:
					products.append(product)
			except Exception:
				errors.append(ValidationIssue(
					message=f"Error in row {row_index}",
					path=f"$.row.{row_index}",
					type="invalid_data"
				))
	except UnicodeDecodeError:
		raise ValidationError(RequestSegment.MULTIPART_FILE, [
			ValidationIssue(
				message="Expected file must be UTF-8 encoded",
				path=None,
				type="invalid_format"
			)
		])
	except csv.Error:
		raise ValidationError(RequestSegment.MULTIPART_FILE, [
			ValidationIssue(
				message="Expected file must be a valid CSV file delimited by ;",
				path=None,
				type="invalid_format"
			)
		])
	
	return (batch, products, errors)


def is_product_csv_header(row: list[str]) -> bool:
	return set(cell.strip().lower() for cell in row) >= EXPECTED_FIELDS


def normalize_csv_fieldnames(reader: csv.DictReader[str]):
	reader.fieldnames = [name.strip().lower() for name in reader.fieldnames]


def save_products_batch(batch: ProductBatch, products: List[Product]):
	if len(products) == 0:
		return
	
	sql = "INSERT INTO products (id, batch_id, name, expiration, price_usd, price_eur, price_jpy, price_brl, price_btc) VALUES"
	pvalues = []
	for n, product in enumerate(products, start=1):
		sql += " (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
		sql += ", " if n != len(products) else ""
		pvalues.append(str(product.id))
		pvalues.append(None if product.batch_id == None else str(product.batch_id))
		pvalues.append(product.name)
		pvalues.append(product.expiration)
		pvalues.append(product.prices.usd.amount)
		pvalues.append(product.prices.eur.amount)
		pvalues.append(product.prices.jpy.amount)
		pvalues.append(product.prices.brl.amount)
		pvalues.append(product.prices.btc.amount)

	db = get_db()
	with db.transaction():
		db.execute(
			"INSERT INTO product_batchs (id, strategy, filename) VALUES (%s, %s, %s)",
			[str(batch.id), batch.strategy.value, batch.filename]
		)
		db.execute(sql, pvalues)
