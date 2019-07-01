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
    connection.query("select item_id, product_name, price, stock_quantity from	products order by product_name", function(err, res) {
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
    connection.query("select item_id, product_name, price, stock_quantity from	products where stock_quantity < 5 order by product_name", function(err, res) {
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
        message: "Enter the ID of the item you want to add inventory for."
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
        connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answer.numUnits + " WHERE item_id = " + answer.itemId, function(err) {
              if (err){
                throw err;
              }
              console.log("Inventory added.");
              connection.end();
            }
          );
    });
}