from app import create_app
from dotenv import load_dotenv
import os

if os.getenv("FLASK_ENV") != "production":
	load_dotenv()

app = create_app()

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=3334)
