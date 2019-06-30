DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE departments(
dept_id integer(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
dept_name VARCHAR(100) NOT NULL,
dept_overhead numeric(10)
 );
 
 INSERT INTO departments (dept_name, dept_overhead)
 values
 ("Hardware", 1000),
 ("Software", 500),
 ("Devices", 650);
 
 select * from departments