DROP TABLE IF EXISTS pantry;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  barcode VARCHAR PRIMARY KEY,
  product_name VARCHAR NOT NULL,
  pic_url VARCHAR NOT NULL,
  created timestamp,
  active BOOLEAN DEFAULT true
);

CREATE TABLE pantry (
  id SERIAL PRIMARY KEY,
  product_barcode VARCHAR REFERENCES products(barcode),
  date timestamp,
  active BOOLEAN DEFAULT true
);§