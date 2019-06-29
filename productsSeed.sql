DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;


CREATE TABLE products (
item_id integer(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price NUMERIC(10) NOT NULL,
stock_quantity NUMERIC(10) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Motherboard", "Hardware", 150, 12),
("RAM", "Hardware", 25, 5),
("CPU", "Hardware", 350, 9),
("Power Supply", "Hardware", 80, 2),
("Windows OS", "Software", 100, 45),
("iOS", "Software", 150, 19),
("MS Office", "Software", 50, 5),
("Apple iPhone", "Devices", 800, 8),
("Samsung S10", "Devices", 700, 0),
("Google Pixel", "Devices", 650, 20); 

select * from products