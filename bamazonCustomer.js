//listed the externale required scripts for this application.
var inquirer = require("inquirer");
var mysql = require("mysql");


//CREATED CONNECTION TO SQL DATABASE******************************
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
//END OF CONNECTION TO SQL****************************************


//CONNECTION FUNCTION*********************************************
connection.connect(function (err) {
  if (err) {
    console.log("error connect" + err.stack);
  };
  console.log("connected as id " + connection.threadId + "\n");

  readProducts();
});
//END OF CONNECTION FUNCTION**************************************


//DISPLAY ALL ITEMS FOR SALE**************************************  
function readProducts() {
  console.log("                                                                                                                      ");
  console.log("**********************************************************************************************************************");
  console.log("                                                                                                                      ");
  console.log("                                                Welcome to Bamazon!!!                                                 ");
  console.log("                                     Please choose from the product listed below!                                     ");
  console.log("                                                                                                                      ");
  console.log("**********************************************************************************************************************");
  console.log("                                                                                                                      ");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);

    promptCustomerForItem();
  });
};
//END OF READPRODUCTS FUNCTION************************************


//GLOBAL VARIABLES************************************************
var productId;
var productSelected;
var priceOfProductSelected;
var departmentOfProductSelected;
var quantityRequested;
var stockQuantityOfItemSelected;
//END OF GLOBAL VARIABLES*****************************************


//PROMPT THE CUSTOMER FOR PRODUCT ID*******************************
function promptCustomerForItem() {
  inquirer
    .prompt({
      name: "item_id",
      type: "number",
      message: "From the table above, please enter the item id of the product you wish to purchase."
    })
    .then(function (answer) {
      var query = "SELECT * FROM products WHERE ?"; //create a variable to hold the SELECT statement
      if (answer.item_id > 13) {
        console.log(`\nYou selected an item that is not on the table.  Please select an item from the table above\n.`)
        promptCustomerForItem();
      } else {
        //Query through the table to find the item_id that the customer would like to purchase.
        connection.query(query, { item_id: answer.item_id }, function (err, res) {
          if (err) throw err;

          productId = res[0].item_id;
          productSelected = res[0].product_name;
          priceOfProductSelected = res[0].price.toFixed(2);
          departmentOfProductSelected = res[0].department_name;
          stockQuantityOfItemSelected = res[0].stock_quantity;


          //After the customer has selected his item, requested a quantity from him. 
          promptCustomerForQuantity();
        });
      }

    })
};
//END OF PROMPTCUSTOMERFORITEM FUNCTION****************************


// PROMPT CUSTOMER FOR QUANTITY************************************
function promptCustomerForQuantity() {
  inquirer
    .prompt({
      name: "quantity",
      type: "number",
      message: "How many would you like to purchase?"
    })
    .then(function (answer) {
      //variable that will capture answer.quantity.
      quantityRequested = parseInt(answer.quantity);

      //Check inventory to see if you have the amount requested in stock.  
      checkInventory();
    });

};
//END OF PROMPTCUSTOMERFORQUANTITY FUNCTION************************


//CHECK TO MAKE SURE THERE IS ENOUGH INVENTORY*********************
function checkInventory() {
  //Check through table for data
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    if (quantityRequested <= stockQuantityOfItemSelected) {
      // console.log("The quantity that you selected can be honored!")
      makePurchase();
    } else {
      console.log(`\n*****Unfortunately we only have ${stockQuantityOfItemSelected} in stock.*****\n`);
      //INSERT INQUIRER PROMPT
      inquirer
        .prompt({
          name: "remainingStock",
          type: "list",
          message: "Would you like to purchase the remaining inventory?",
          choices: ["Yes", "No"]
        })
        .then(function (answer) {
          if (answer.remainingStock === "Yes") {
            console.log("");
            console.log("Please view the table for the stock quantity and select available stock.");
            console.log("");
            readProducts();
          } else {
            shopOrExit();
          }
          // Use user feedback for... whatever!!
        });
    }

  });
};
//END OF CHECK INVENTORY FUNCTION**********************************

// //CREATE THE PURCHASE FUNCTION FOR DESIRED ITEM.****************
function makePurchase() {
  console.log("");
  console.log("");
  console.log(`****************************`);
  console.log(`SALE SUMMARY`);
  console.log(`----------------------------`);
  console.log(`Product: ${productSelected}`);
  console.log(`Quantity: ${quantityRequested}`);
  console.log(`Department: ${departmentOfProductSelected}`);
  console.log(`Price: $${priceOfProductSelected}`);

  var totalPrice = parseInt(quantityRequested * priceOfProductSelected).toFixed(2);
  console.log(`Total Price: $${totalPrice}`);
  confirmPurchase();
};
//END OF THE MAKE PURCHASE FUNCTION********************************

//CREATE THE UPDATE INVENTORY FUNCTION ****************************
function updateInventory() {

  var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";

  //Query through the table to find the item_id that the customer would like to purchase.
  connection.query(query, [quantityRequested, productId], function (err, res) {
    if (err) throw err;
    // console.log(`Inventory Updated!`);

  });

};
//END OF UPDATE INVENTORY FUNCTION*********************************


//HAVE USER CONFIRM PURCHASE***************************************
function confirmPurchase() {
  inquirer
    .prompt({
      name: "confirm",
      type: "list",
      message: "Would you like to confirm purchase?",
      choices: ["Yes", "No"]
    })
    .then(function (answer) {

      if (answer.confirm === "Yes") {
        console.log(`----------------------------`);
        console.log(`----------------------------`);
        console.log(`Your purchase is confirmed.  Your package will be shipped with the preferred shipping method on file.`)
        console.log(`Thank you for shopping with Bamazon!`);
        console.log(`----------------------------`);
        console.log(`----------------------------`);
        console.log("");
        updateInventory();
        shopOrExit();
      } else {
        console.log(`We are sorry that you didn't like any of the products.  We hope you come again! :-)`)
        shopOrExit();
      }
      // Use user feedback for... whatever!!
    });
}
// END OF CONFIRM PURCHASE FUNCTION********************************


//CHECK IF USER WANTS TO CONTINUE SHOPPING*************************
function shopOrExit() {
  inquirer
    .prompt({
      name: "shopOrExit",
      type: "list",
      message: "Would you like to continue shopping?",
      choices: ["Yes", "No"]
    })
    .then(function (answer) {
      if (answer.shopOrExit === "Yes") {
        readProducts();
      } else {
        connection.end();
      }
      // Use user feedback for... whatever!!
    });
}
//END OF SHOP OR EXIT FUNCTION*************************************
