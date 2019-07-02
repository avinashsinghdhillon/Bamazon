var mysql = require("mysql");
var inquirer = require("inquirer");
var dotenv = require("dotenv").config();
var {table} = require("table");

function supervisorMainMenu() {
    inquirer
    .prompt([
      {
        name: "task",
        type: "list",
        message: "Please choose a task:",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"]
      }
    ])
    .then(function(answer) {
        debugger;
        switch (answer.task) {
            case "View Product Sales by Department":
                showProductSales();
                break;
            case "Create New Department":
                createNewDept();
                break;
            default:
                connection.end();
                break;
        }
    });
}

//this is the entry-point of the app
supervisorMainMenu();

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

function showProductSales(){
    console.log(`
------------------------------------------------------------------------------------
                            Product Sales by Department
------------------------------------------------------------------------------------
    `);
    let query = connection.query(
    `
    select 
        d.dept_id as "department_id",
        d.dept_name as "department_name",
        d.dept_overhead as "over_head_cost",
        sum(p.product_sales) as product_sales,
        sum(p.product_sales) - d.dept_overhead as "total_profit"
    from
        departments d left outer join
        products p
    on
        d.dept_id = p.department_id
    group by
        p.department_id
    `
    , function(err, res) {
        if (err) throw err;
        var displayArr = [["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"]];
        for(let i = 0; i < res.length; i++){
            displayArr.push([res[i].department_id, res[i].department_name, 
                            res[i].over_head_cost, res[i].product_sales,
                            res[i].total_profit]);
        }
        let data, output;
        data = displayArr;
        output = table(data);
        console.log(output);
        connection.end();
        });
}

function createNewDept(){
    inquirer.prompt([
        {
            type: "input",
            name: "deptName",
            message: "Enter department name: "
        },
        {
            type: "number",
            name: "deptOverhead",
            message: "Enter the department overhead: ",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        }
    ]).then(function (answer){
        query = connection.query(
            "INSERT INTO departments SET ?",
              {
                dept_name: answer.deptName,
                dept_overhead: answer.deptOverhead
              },
            function(err) {
                if (err){
                  throw err;
                }
                console.log("Department added.");
                connection.end();
              }
        );
    });

}