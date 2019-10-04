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

    promptCustomerForItem();
  });
}


//Prompt the customer for Product ID
function promptCustomerForItem() {
  inquirer
    .prompt({
      name: "item_id",
      type: "number",
      message: "From the table above, please enter the item id of the product you wish to purchase."
    })
    .then(function (answer) {
      var query = "SELECT * FROM products WHERE ?"; //create a variable to hold the SELECT statement

      //Query through the table to find the item_id that the customer would like to purchase.
      connection.query(query, { item_id: answer.item_id }, function (err, res) {
        if (err) throw err;

        //Display the item that the user has selected to purchase.
        console.log(`The item that you selected to purchse is ${res[0].product_name} for $${res[0].price}.`);
        connection.end();
      });
    })
}
// //prompt customer for quantity
// function promptCustomerForQuantity() {

// }

// //Purhase function to buy desire item
// function makePurchase() {

// }

// //Check inventory to see if the user choice exist.
// function checkInventory() {

// }

// //Check to see if the user want to exit.
// function exit() {

// }