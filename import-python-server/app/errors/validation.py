from dataclasses import dataclass, asdict
from enum import Enum
from typing import Optional, List

from .app_error import AppError, HttpErrorObject

@dataclass(frozen=True)
class ValidationIssue:
	message: str
	path: Optional[str]
	type: str


class RequestSegment(Enum):
	BODY = "BODY"
	PARAMS = "PARAM"
	QUERY = "QUERY"
	HEADERS = "HEADER"
	COOKIES = "COOKIE"
	SIGNED_COOKIES = "SIGNED_COOKIE"
	MULTIPART_FILE = "MULTIPART_FILE"
	MULTIPART_FIELD = "MULTIPART_FIELD"
	UNKNOWN = "UNKNOWN"


class ValidationError(AppError):
	error: str = "VALIDATION"

	def __init__(
		self,
		segment: RequestSegment,
		issues: List[ValidationIssue],
	) -> None:
		super().__init__("Validation error")
		self.segment = segment
		self.issues = issues

	def http_error_object(self) -> HttpErrorObject:
		return {
			"status": 400,
			"error": self.error,
			"message": str(self),
			"segment": self.segment.value,
			"issues": [asdict(issue) for issue in self.issues],
		}
