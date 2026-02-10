from flask import jsonify

from ..errors.app_error import HttpBaseError

def handle_http_error(error: HttpBaseError):
	payload, status = error.to_flask_response()
	return jsonify(payload), status

def handle_file_too_large(error):
	return jsonify({
		"status": 413,
		"error": "PAYLOAD_TOO_LARGE",
		"message": "Uploaded file is too large",
	}), 413
