from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any


HttpErrorObject = Dict[str, Any]

FlaskErrorResponse = Tuple[Dict[str, Any], int]

class HttpBaseError(Exception, ABC):
	@abstractmethod
	def http_error_object(self) -> HttpErrorObject:
		...
	
	def to_flask_response(self) -> FlaskErrorResponse:
		data = self.http_error_object()
		return data, data["status"]


class AppError(HttpBaseError):
	def http_error_object(self) -> HttpErrorObject:
		return {
			"status": 500,
			"error": "INTERNAL_SERVER_ERROR",
			"message": "Server encountered an error processing the request",
		}
