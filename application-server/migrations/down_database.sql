-- product price indexes
DROP INDEX IF EXISTS idx_products_price_usd;
DROP INDEX IF EXISTS idx_products_price_eur;
DROP INDEX IF EXISTS idx_products_price_brl;
DROP INDEX IF EXISTS idx_products_price_jpy;
DROP INDEX IF EXISTS idx_products_price_btc;

-- tables
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_batchs;
DROP TABLE IF EXISTS currencies;

-- types
DROP TYPE IF EXISTS currency;
DROP TYPE IF EXISTS currency_code;
