from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from ulid import ULID


PreciseAmount = int
Unit = int

class ImportStrategy(Enum):
	ATOMIC = "atomic"
	PARTIAL = "partial"

class CurrencyCode(Enum):
	"""
	Supported currency codes (ISO 4217 compliant, except BTC)
	"""
	USD = "USD"
	EUR = "EUR"
	JPY = "JPY"
	BRL = "BRL"
	BTC = "BTC"


class RoundingMode(Enum):
	TRUNCATE = "truncate"
	HALF_UP = "half_up"


@dataclass(frozen=True)
class PreciseNumber:
	"""
	Number represented as the smallest currency amount.
	"""
	amount: PreciseAmount
	unit: Unit

	def add(self, other: "PreciseNumber") -> "PreciseNumber":
		max_unit = max(self.unit, other.unit)
		scaled_self = self.amount * 10 ** (max_unit - self.unit)
		scaled_other = other.amount * 10 ** (max_unit - other.unit)
		return PreciseNumber(amount=scaled_self + scaled_other, unit=max_unit)
	
	def subtract(self, other: "PreciseNumber") -> "PreciseNumber":
		max_unit = max(self.unit, other.unit)
		scaled_self = self.amount * 10 ** (max_unit - self.unit)
		scaled_other = other.amount * 10 ** (max_unit - other.unit)
		return PreciseNumber(
			amount=scaled_self - scaled_other,
			unit=max_unit,
		)

	def multiply(self, other: "PreciseNumber") -> "PreciseNumber":
		return PreciseNumber(
			amount=self.amount * other.amount,
			unit=self.unit + other.unit,
		)

	def divide(self, other: "PreciseNumber", *, target_unit: int | None = None) -> "PreciseNumber | None":
		if other.amount == 0:
			return None

		if target_unit is None:
			target_unit = max(self.unit, other.unit)

		scale = 10 ** (target_unit + other.unit - self.unit)
		result_amount = (self.amount * scale) // other.amount

		return PreciseNumber(amount=result_amount, unit=target_unit)
	
	def normalize(self, target_unit: int, *, rounding: RoundingMode = RoundingMode.TRUNCATE) -> "PreciseNumber":
		if target_unit < 0:
			raise ValueError("target_unit must be >= 0")

		if target_unit == self.unit:
			return self

		# Increase precision
		if target_unit > self.unit:
			scale = 10 ** (target_unit - self.unit)
			return PreciseNumber(
				amount=self.amount * scale,
				unit=target_unit,
			)

		# Reduce precision — rounding required
		diff = self.unit - target_unit
		factor = 10 ** diff

		if rounding is RoundingMode.TRUNCATE:
			return PreciseNumber(
				amount=self.amount // factor,
				unit=target_unit,
			)

		if rounding is RoundingMode.HALF_UP:
			half = factor // 2
			adjustment = half if self.amount >= 0 else -half
			return PreciseNumber(
				amount=(self.amount + adjustment) // factor,
				unit=target_unit,
			)

		raise ValueError(f"Unsupported rounding mode: {rounding}")
	
	
	def __add__(self, other: "PreciseNumber") -> "PreciseNumber":
		return self.add(other)

	def __sub__(self, other: "PreciseNumber") -> "PreciseNumber":
		return self.subtract(other)

	def __mul__(self, other: "PreciseNumber") -> "PreciseNumber":
		return self.multiply(other)


@dataclass(frozen=True)
class CurrencyType:
	"""
	Currency value
	"""
	code: CurrencyCode
	amount: PreciseAmount


@dataclass(frozen=True)
class ProductPrice:
	"""
	Prices in supported currencies
	"""
	usd: CurrencyType
	eur: CurrencyType
	jpy: CurrencyType
	brl: CurrencyType
	btc: CurrencyType


@dataclass(frozen=True)
class ProductBatch:
	id: ULID
	created: datetime
	strategy: ImportStrategy
	filename: str

	@classmethod
	def new(cls, filename: str, strategy: ImportStrategy) -> "ProductBatch":
		return cls(
			id=ULID(),
			created=datetime.now(timezone.utc),
			strategy=strategy,
			filename=filename,
		)
	
	def to_dict(self):
		return {
			"id": str(self.id),
			"created": self.created.isoformat(),
			"strategy": self.strategy.value,
			"filename": self.filename,
		}


@dataclass(frozen=True)
class Product:
	id: ULID
	created: datetime
	batch_id: Optional[ULID]
	name: str
	prices: ProductPrice
	expiration: datetime
