var mysql = require("mysql");
var inquirer = require("inquirer");
var dotenv = require("dotenv").config();
var {table} = require("table");

function managerMainMenu() {
    inquirer
    .prompt([
      {
        name: "task",
        type: "list",
        message: "What do you want to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
      }
    ])
    .then(function(answer) {
        debugger;
        switch (answer.task) {
            case "View Products for Sale":
                showProducts();
                break;
            case "View Low Inventory":
                showLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            default:
                connection.end();
                break;
        }
    });
}

//this is the entry-point of the app
managerMainMenu();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "bamazon"
    });
    connection.connect(function(err) {
    if (err) throw err;
});

function showProducts(){
    console.log(`
----------------------------------------
            Products For Sale
----------------------------------------
    `);
    let query = connection.query("select item_id, product_name, price, stock_quantity from	products order by product_name", function(err, res) {
        if (err) throw err;
        var displayArr = [["ID", "ITEM", "PRICE", "Quantity"]];
        for(let i = 0; i < res.length; i++){
            displayArr.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }
        let data, output;
        data = displayArr;
        output = table(data);
        console.log(output);
        connection.end();
        });
}

function showLowInventory(){
    console.log(`
----------------------------------------
            Low Inventory
----------------------------------------
    `);
    let query = connection.query("select item_id, product_name, price, stock_quantity from	products where stock_quantity < 5 order by product_name", function(err, res) {
        if (err) throw err;
        var displayArr = [["ID", "ITEM", "PRICE", "Quantity"]];
        for(let i = 0; i < res.length; i++){
            displayArr.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }
        let data, output;
        data = displayArr;
        output = table(data);
        console.log(output);
        connection.end();
        });
}

function addInventory(){
    inquirer
    .prompt([
      {
        name: "itemId",
        type: "number",
        message: "Enter the ID of the item you want to add inventory for.",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "numUnits",
        type: "number",
        message: "How many units would you like to add to the inventory?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
        }
      }
    ])
    .then(function(answer) {
      let query = connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answer.numUnits + " WHERE item_id = " + answer.itemId, function(err) {
          if (err){
            throw err;
          }
          console.log("Inventory added.");
          connection.end();
        }
      );
    });
}

function addProduct(){
  //first get the list of categories/dept_name from the departments table
  let categoryList = new Array();
  let categories = new Array();
  let query = connection.query("SELECT dept_id, dept_name from departments", function(err, results) {
    if (err){
      throw err;
    }
    for(let i = 0; i < results.length; i++){
      let catData = {
        id:results[i].dept_id,
        category:results[i].dept_name
      }
      categoryList.push(catData);
      categories.push(results[i].dept_name);
    }

    inquirer.prompt([
      {
        type: "list",
        name: "catSelected",
        message: "Select the category for the new product: ",
        choices: categories
      },
      {
        name: "prodName",
        type: "input",
        message: "Enter the product name: ",
      },
      {
        name: "unitPrice",
        type: "number",
        message: "Enter the product price per unit: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "stockQuantity",
        type: "number",
        message: "Enter the product's quantity in stock: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
        default: 0
      }
    ])
    .then(function(answer) {
      //find the deptID from the categoryList
      let deptID = categoryList[categories.indexOf(answer.catSelected)].id;

      //Add the new data row to the products table
      query = connection.query(
        "INSERT INTO products SET ?",
          {
            product_name: answer.prodName,
            department_id: deptID,
            price: answer.unitPrice,
            stock_quantity: answer.stockQuantity
          },
        function(err) {
            if (err){
              throw err;
            }
            console.log("Product added.");
            connection.end();
          }
        );
    });

    }
  );
}