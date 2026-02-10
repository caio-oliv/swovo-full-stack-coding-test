import os
from psycopg import Connection
from psycopg_pool import ConnectionPool
from flask import g, current_app, Flask


def make_connection_pool() -> ConnectionPool:
	return ConnectionPool(conninfo=os.environ["DATABASE_URL"], min_size=1, max_size=10)

def init_db(app: Flask):
	app.extensions["db_pool"] = make_connection_pool()

def get_pool() -> ConnectionPool:
	return current_app.extensions["db_pool"]

def get_db() -> Connection:
	if "db" not in g:
		pool = get_pool()
		g.db = pool.getconn()
	return g.db

def close_db(exception: Exception | None) -> None:
	db = g.pop("db", None)
	if db is None:
		return
	
	try:
		if exception is None:
			db.commit()
		else:
			db.rollback()
	finally:
		pool = get_pool()
		pool.putconn(db)
