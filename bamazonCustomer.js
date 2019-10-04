//listed the externale required scripts for this application.
var inquirer = require("inquirer");
var mysql = require("mysql");

//CREATED CONNECTION TO SQL DATABASE
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) {
    console.log("error connect" + err.stack);
  };
  console.log("connected as id " + connection.threadId + "\n");

  readProducts();
});

//Display all the items available for sale.  
function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);

    // promptCustomerForItem();
  });
}


//Prompt the customer for Product ID
function promptCustomerForItem() {

}

//prompt customer for quantity
function promptCustomerForQuantity() {

}

//Purhase function to buy desire item
function makePurchase() {

}

//Check inventory to see if the user choice exist.
function checkInventory() {

}

//Check to see if the user want to exit.
function exit() {
  
}