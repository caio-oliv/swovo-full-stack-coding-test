import re
from typing import Any
from datetime import date

from ..entities.product import PreciseNumber, ImportStrategy


MAX_NAME_LENGTH = 1024

def parse_product_name(value: Any) -> str | None:
	if value is None:
		return None

	name = str(value).strip()

	if not name:
		return None

	if len(name) > MAX_NAME_LENGTH:
		return None

	return name


PRICE_PATTERN = re.compile(r"^\$(0|[1-9]\d*)\.(\d{2})$")

def parse_csv_price(value: Any) -> PreciseNumber | None:
	if value is None:
		return None

	text = str(value).strip()

	match = PRICE_PATTERN.match(text)
	if not match:
		return None

	dollars, cents = match.groups()
	amount = int(dollars) * 100 + int(cents)
	return PreciseNumber(amount=amount, unit=2)


DATE_PATTERN = re.compile(r"^(\d{1,2})/(\d{1,2})/(\d{3,4})$")

def parse_csv_date(value: Any) -> date | None:
	if value is None:
		return None

	text = str(value).strip()

	match = DATE_PATTERN.match(text)
	if not match:
		return None

	month, day, year = map(int, match.groups())

	try:
		return date(year, month, day)
	except ValueError:
		return None


def is_all_number(s: str) -> bool:
	if not s:
		return False
	if s[0] == "-":
		return s[1:].isdigit()
	return s.isdigit()


def parse_precise_number(fixed: str) -> PreciseNumber | None:
	parts = fixed.split(".")
	if len(parts) > 2:
		return None

	integral = parts[0]
	fraction = parts[1] if len(parts) == 2 else ""

	if not integral:
		return None

	full = integral + fraction

	if not is_all_number(full):
		return None

	return PreciseNumber(amount=int(full), unit=len(fraction))


def parse_strategy(value: Any) -> ImportStrategy | None:
	if not isinstance(value, str):
		return None
	
	if value == "atomic":
		return ImportStrategy.ATOMIC
	if value == "partial":
		return ImportStrategy.PARTIAL
	
	return None
