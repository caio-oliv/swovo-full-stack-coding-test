from ulid import ULID

from app.entities.product import PreciseNumber, Product
from app.services.exchange import ExchangeRate
from app.services.import_products import parse_product_row

def make_exchange_rate() -> ExchangeRate:
	return ExchangeRate(
		usd=PreciseNumber(amount=100, unit=2),
		eur=PreciseNumber(amount=100, unit=2),
		jpy=PreciseNumber(amount=100, unit=2),
		brl=PreciseNumber(amount=100, unit=2),
		btc=PreciseNumber(amount=100, unit=2),
	)

def test_parse_product_row_valid_1():
	rate = make_exchange_rate()
	row = {
		"name": "Cheese - Grana Padano #(3566971102136738)",
		"price": "$163.88",
		"expiration": "1/14/2023",
	}
	product = parse_product_row(row, 0, ULID(), rate)

	assert isinstance(product, Product)
