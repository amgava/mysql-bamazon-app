CREATE DATABASE bamazon;

USE DATABASE bamazon;

CREATE TABLE products
(
  id int(11) NOT NULL AUTO_INCREMENT,
  item_id varchar(10) DEFAULT NULL,
  product_name varchar(90) DEFAULT NULL,
  department_name varchar(90) DEFAULT NULL,
  price decimal(7,2) DEFAULT NULL,
  stock_quantity int(5) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  UNIQUE KEY item_id_UNIQUE (item_id)
);