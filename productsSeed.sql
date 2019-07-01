USE bamazon;


CREATE TABLE products (
item_id integer(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
department_id INTEGER NOT NULL,
price NUMERIC(10) NOT NULL,
stock_quantity NUMERIC(10) NOT NULL,
product_sales NUMERIC(10)  DEFAULT 0,
FOREIGN KEY (department_id) REFERENCES departments(dept_id)
);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES
("Motherboard", 1, 150, 12),
("RAM", 1, 25, 5),
("CPU", 1, 350, 9),
("Power Supply", 1, 80, 2),
("Windows OS", 2, 100, 45),
("iOS", 2, 150, 19),
("MS Office", 2, 50, 5),
("Apple iPhone", 3, 800, 8),
("Samsung S10", 3, 700, 0),
("Google Pixel", 3, 650, 20); 

select * from products