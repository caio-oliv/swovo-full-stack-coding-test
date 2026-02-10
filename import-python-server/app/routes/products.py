from flask import Blueprint, jsonify, request, current_app, Response

from ..entities.product import ImportStrategy
from ..services.type_parser import parse_strategy
from ..services.import_products import parse_products_csv_file, save_products_batch
from ..services.exchange import get_currency_exchange_rate
from ..errors.validation import ValidationError, RequestSegment, ValidationIssue
from ..errors.service import ServiceError, ServiceErrorType

products_bp = Blueprint("products", __name__)

@products_bp.route("/product", methods=["POST"])
def import_products() -> Response:
	strategystr = request.form.get("strategy")
	strategy = parse_strategy(strategystr)
	if strategy is None:
		raise ValidationError(RequestSegment.MULTIPART_FIELD, [
			ValidationIssue(
				message="No strategy was found in the request multipart field",
				path="$.strategy",
				type="not_found"
			)
		])
	
	file = request.files.get("file")

	if not file or file.filename == "":
		raise ValidationError(RequestSegment.MULTIPART_FILE, [
			ValidationIssue(
				message="No file was found in the request multipart file",
				path="$.file",
				type="not_found"
			)
		])

	if not file.filename.lower().endswith(".csv"):
		raise ValidationError(RequestSegment.MULTIPART_FILE, [
			ValidationIssue(
				message="Expected file must be a CSV",
				path="$.file",
				type="invalid_format"
			)
		])
	
	exchange = get_currency_exchange_rate()
	if exchange is None:
		current_app.logger.error("get exchange rate service unavailable")
		raise ServiceError(ServiceErrorType.UNAVAILABLE)
	
	batch, products, issues = parse_products_csv_file(file, exchange, strategy)
	if strategy == ImportStrategy.ATOMIC and len(issues) != 0:
		raise ValidationError(RequestSegment.MULTIPART_FILE, issues)
	
	save_products_batch(batch, products)

	return jsonify({
		"batch": batch.to_dict(),
		"issues": issues,
		"imported": len(products),
		"strategy": batch.strategy.value
	}), 201
