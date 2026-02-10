CREATE TYPE currency_code AS ENUM ('USD', 'EUR', 'JPY', 'BRL', 'BTC');

CREATE TYPE currency AS (code currency_code, amount BIGINT);

CREATE TABLE IF NOT EXISTS currencies (
	code currency_code,
	unit SMALLINT NOT NULL,
	description TEXT NOT NULL,

	CONSTRAINT cstr_currency_pk PRIMARY KEY (code)
);

INSERT INTO currencies (code, unit, description) VALUES
	('USD', 2, 'US Dollar'),
	('EUR', 2, 'Euro'),
	('JPY', 0, 'Japanese Yen'),
	('BRL', 2, 'Brazilian Real'),
	('BTC', 8, 'Bitcoin');

CREATE TABLE IF NOT EXISTS products (
	id TEXT,
	created TIMESTAMP(3) NOT NULL DEFAULT now(),
	batch_id TEXT,
	name TEXT NOT NULL,
	expiration TIMESTAMP(3) NOT NULL,

	price_usd BIGINT NOT NULL,
	price_eur BIGINT NOT NULL,
	price_jpy BIGINT NOT NULL,
	price_brl BIGINT NOT NULL,
	price_btc BIGINT NOT NULL,
	
	CONSTRAINT cstr_products_pk PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_products_price_usd ON products (price_usd);

CREATE INDEX IF NOT EXISTS idx_products_price_eur ON products (price_eur);

CREATE INDEX IF NOT EXISTS idx_products_price_brl ON products (price_brl);

CREATE INDEX IF NOT EXISTS idx_products_price_jpy ON products (price_jpy);

CREATE INDEX IF NOT EXISTS idx_products_price_btc ON products (price_btc);

CREATE TABLE IF NOT EXISTS product_batchs (
	id TEXT,
	created TIMESTAMP(3) NOT NULL DEFAULT now(),
	strategy TEXT NOT NULL,
	filename TEXT NOT NULL,
	
	CONSTRAINT cstr_product_batchs_pk PRIMARY KEY (id)
);
