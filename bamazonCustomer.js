var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table");
var itemList = new Array();

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
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
    var displayArr = [["ID", "ITEM", "PRICE"]];
    //debugger;
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
    console.log("sufficient qty...");
    connection.query("select stock_quantity, price from products where item_id = '" + itemId + "'", function(err, res) {
        if (err) throw err;
        console.log("Inside Qty quey...");
        console.log("Num Units: " + numUnits);
        console.log("Qty avail: " + res[0].stock_quantity);
        console.log("Sun: " + numUnits + res[0].stock_quantity);
        if(parseInt(numUnits) < parseInt(res[0].stock_quantity)){
            processSale(itemId, numUnits, res[0].stock_quantity, res[0].price);
        }else{
            console.log("Insufficient Quantity!!!");
        }
        });
}

function processSale(itemId, numUnits, stockQty, unitPrice){
    console.log("in process Sale....");//////////////////////////////
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: stockQty - numUnits
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