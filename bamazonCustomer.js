var mysql = require("mysql");
var inquirer = require("inquirer");
var dotenv = require("dotenv").config();
var {table} = require("table");
var itemList = new Array();

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.DB_PASSWORD,
    database: "bamazon"
    });

    connection.connect(function(err) {
    if (err) throw err;
    getItems();
});

function getItems (){
connection.query("select item_id, product_name, price from	products order by product_name", function(err, res) {
    if (err) throw err;
    itemList = res;
    displayItems(itemList);
    postSale();
    });
}

function displayItems(itemsToDisplay){
  console.log(`
  -----------------------------------
          Products For Sale
  -----------------------------------
      `);
    var displayArr = [["ID", "ITEM", "PRICE"]];
    for(let i = 0; i < itemsToDisplay.length; i++){
        displayArr.push([itemsToDisplay[i].item_id, itemsToDisplay[i].product_name, itemsToDisplay[i].price]);
    }
    let data, output;
    data = displayArr;
    output = table(data);
    console.log(output);
}


function postSale(){
    inquirer
    .prompt([
      {
        name: "itemId",
        type: "number",
        message: "Enter the ID of the item you want to buy."
      },
      {
        name: "numUnits",
        type: "number",
        message: "How many units would you like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
        }
      }
    ])
    .then(function(answer) {
        sufficientQty(answer.itemId, answer.numUnits);
    });
}

function sufficientQty(itemId, numUnits){
    connection.query("select stock_quantity, price from products where item_id = '" + itemId + "'", function(err, res) {
        if (err) throw err;
        if(parseInt(numUnits) < parseInt(res[0].stock_quantity)){
            processSale(itemId, numUnits, res[0].stock_quantity, res[0].price);
        }else{
            console.log("Insufficient Quantity!!!");
        }
        });
}

function processSale(itemId, numUnits, stockQty, unitPrice){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: stockQty - numUnits,
            product_sales: numUnits * unitPrice
          },
          {
            item_id: itemId
          }
        ],
        function(err) {
          if (err){
            throw err;
          }
          console.log("Purchase total: $" + numUnits * unitPrice);
          connection.end();
        }
      );
}