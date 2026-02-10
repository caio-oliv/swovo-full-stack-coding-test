from typing import Any
from ulid import ULID
from datetime import datetime, timezone

from ..errors.validation import ValidationIssue
from ..entities.product import Product, ProductPrice, CurrencyType, CurrencyCode
from .type_parser import parse_csv_price, parse_csv_date, parse_product_name
from .exchange import ExchangeRate

RowType = dict[str | Any, str | Any]

def parse_product_row(row: RowType, row_index: int, batch_id: ULID, exchange: ExchangeRate) -> Product | ValidationIssue:
	name = parse_product_name(row["name"])
	if name is None:
		return ValidationIssue(
			message=f"Expected name in row index {row_index} is invalid '{row['name']}'",
			path=f"$.row.{row_index}",
			type="invalid_format",
		)

	usd = parse_csv_price(row["price"])
	if usd is None:
		return ValidationIssue(
			message=f"Expected price in USD in row index {row_index} is invalid '{row['price']}'",
			path=f"$.row.{row_index}",
			type="invalid_format",
		)
	
	expiration = parse_csv_date(row["expiration"])
	if expiration is None:
		return ValidationIssue(
			message=f"Expected expiration date in row index {row_index} is invalid '{row['expiration']}'",
			path=f"$.row.{row_index}",
			type="invalid_format",
		)
	
	return Product(
		id=ULID(),
		created=datetime.now(timezone.utc),
		batch_id=batch_id,
		name=name,
		prices=ProductPrice(
			usd=CurrencyType(code=CurrencyCode.USD, amount=usd.amount),
			eur=CurrencyType(code=CurrencyCode.EUR, amount=usd.multiply(exchange.eur).normalize(2).amount),
			jpy=CurrencyType(code=CurrencyCode.JPY, amount=usd.multiply(exchange.jpy).normalize(0).amount),
			brl=CurrencyType(code=CurrencyCode.BRL, amount=usd.multiply(exchange.brl).normalize(2).amount),
			btc=CurrencyType(code=CurrencyCode.BTC, amount=usd.multiply(exchange.btc).normalize(8).amount),
		),
		expiration=expiration,
	)
