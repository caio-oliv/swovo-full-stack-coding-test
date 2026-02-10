from dataclasses import dataclass
from flask import current_app
import requests

from .type_parser import parse_precise_number
from ..entities.product import CurrencyCode, PreciseNumber

USD_EXCHANGE_RATE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"


@dataclass(frozen=True)
class ExchangeRate:
	"""
	Prices in supported currencies
	"""
	usd: PreciseNumber
	eur: PreciseNumber
	jpy: PreciseNumber
	brl: PreciseNumber
	btc: PreciseNumber


def get_currency_exchange_rate() -> ExchangeRate | None:
	try:
		response = requests.get(USD_EXCHANGE_RATE_URL, timeout=5)
		response.raise_for_status()
		data = response.json()
	except (requests.RequestException, ValueError) as err:
		current_app.logger.error(f"get exchange rate error: {err}")
		return None

	rates = data.get("usd")
	if not isinstance(rates, dict):
		return None

	eur = extract_currency_precise_number(rates, CurrencyCode.EUR)
	if eur is None:
		return None
	jpy = extract_currency_precise_number(rates, CurrencyCode.JPY)
	if jpy is None:
		return None
	brl = extract_currency_precise_number(rates, CurrencyCode.BRL)
	if brl is None:
		return None
	btc = extract_currency_precise_number(rates, CurrencyCode.BTC)
	if btc is None:
		return None
	
	rate = ExchangeRate(
		usd=PreciseNumber(amount=100, unit=2),
		eur=eur,
		jpy=jpy,
		brl=brl,
		btc=btc,
	)

	current_app.logger.info(f"exchange rate {rate}")

	return rate


def extract_currency_precise_number(rates: dict, currency: CurrencyCode) -> PreciseNumber | None:
	rate = rates.get(currency.value.lower())
	if rate is None:
		current_app.logger.info(f"exchange rate of currency {currency.value} was not found")
		return None
	
	if not isinstance(rate, int) and not isinstance(rate, float):
		current_app.logger.info(f"exchange rate of currency {currency.value} is not a valid number {rate}")
		return None
	
	ratestr = format(rate, '.15f')
	current_app.logger.info(f"exchange rate of currency {currency.value} as string {ratestr}")

	return parse_precise_number(ratestr)
