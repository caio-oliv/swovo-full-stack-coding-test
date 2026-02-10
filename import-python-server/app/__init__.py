from flask import Flask
from flask_cors import CORS
from werkzeug.exceptions import RequestEntityTooLarge
from .config import Config
from .routes.products import products_bp
from .routes.base import handle_http_error, handle_file_too_large
from .errors.app_error import HttpBaseError
from .extensions.database import init_db, close_db

def create_app():
	app = Flask(__name__, static_folder=None)
	app.config.from_object(Config)

	CORS(app)

	init_db(app)
	app.teardown_appcontext(close_db)

	app.register_error_handler(RequestEntityTooLarge, handle_file_too_large)
	app.register_error_handler(HttpBaseError, handle_http_error)
	
	app.register_blueprint(products_bp, url_prefix="/api/import")

	return app
