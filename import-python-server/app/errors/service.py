from enum import Enum

from .app_error import AppError, HttpErrorObject

class ServiceErrorType(Enum):
	UNAVAILABLE = "UNAVAILABLE"
	NOT_IMPLEMENTED = "NOT_IMPLEMENTED"
	INTERNAL_ERROR = "INTERNAL_ERROR"

	def as_http_status(self) -> int:
		if self == ServiceErrorType.UNAVAILABLE:
			return 503
		elif self == ServiceErrorType.NOT_IMPLEMENTED:
			return 501
		return 500


class ServiceError(AppError):
	error: ServiceErrorType

	def __init__(
		self,
		type: ServiceErrorType = ServiceErrorType.INTERNAL_ERROR,
	) -> None:
		super().__init__("Service error")
		self.error = type

	def http_error_object(self) -> HttpErrorObject:
		return {
			"status": self.error.as_http_status(),
			"error": self.error.value,
			"message": str(self),
		}
