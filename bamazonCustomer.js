//listed the externale required scripts for this application.
var inquirer = require("inquirer");
var mysql = require("mysql");

//CREATED CONNECTION TO SQL DATABASE********
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
//END OF CONNECTION TO SQL******************
connection.connect(function (err) {
  if (err) {
    console.log("error connect" + err.stack);
  };
  console.log("connected as id " + connection.threadId + "\n");

  readProducts();
});

//DISPLAY ALL ITEMS FOR SALE*****************  
function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);

    promptCustomerForItem();
  });
};
//END OF READPRODUCTS FUNCTION***************


//GLOBAL VARIABLES***************************

//END OF GLOBAL VARIABLES********************
var productSelected;
var priceOfProductSelected;
var departmentOfProductSelected;
var quantityRequested;
var stockQuantityOfItemSelected

//ESTABLISH A FUNCTION FOR THE ENTIRE
//PROMPT THE CUSTOMER FOR PRODUCT ID*********
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
        productSelected = res[0].product_name;
        priceOfProductSelected = res[0].price;
        departmentOfProductSelected = res[0].department_name;
        console.log(`Item Selected: ${productSelected} from ${departmentOfProductSelected} department. Price $${priceOfProductSelected}.\n`);

        //After the customer has selected his item, requested a quantity from him. 
        promptCustomerForQuantity();
      });
    })
};
//END OF PROMPTCUSTOMERFORITEM FUNCTION******


// PROMPT CUSTOMER FOR QUANTITY**************
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
      //Display to the user the quantity that they selected.
      console.log(`Quantity Selected: ${quantityRequested} \nPlease be patient as we check inventory for product.`);
      console.log(`****************************`)
      //Check inventory to see if you have the amount requested in stock.  
      checkInventory();
    });

  // checkInventory();

};
//END OF PROMPTCUSTOMERFORQUANTITY FUNCTION**

// //CREATE THE PURCHASE FUNCTION FOR DESIRED ITEM.
function makePurchase() {
  console.log(`****************************`);
  console.log(`Sale Summary`);
  console.log(`----------------------------`);
  console.log(`Product: ${productSelected}`);
  console.log(`Quantity: ${quantityRequested}`);
  console.log(`Department: ${departmentOfProductSelected}`);
  console.log(`Price: ${priceOfProductSelected}`);
  
  var totalPrice = parseInt(quantityRequested * priceOfProductSelected);
  console.log(`Total Price: $${totalPrice}`);
  console.log(`----------------------------`);
  console.log(`Thank you for your purchase!`);
  
  function updateInventory() {
    if (productSelected) {
      let newStockQuantity = stockQuantityOfItemSelected - quantityRequested;
      console.log(`New Stock Quantity: ${newStockQuantity}`);
    }
  }

  updateInventory();
  connection.end();
  
};
// //END OF PURCHASE FUNCTION***********************



//Check inventory against the quantity that the user is requesting.
function checkInventory() {
  //Check through table for data
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;


    //Variable to hold the stockQuantity of item selected.
    stockQuantityOfItemSelected = res[0].stock_quantity;
    
    console.log(`Stock On Hand: ${stockQuantityOfItemSelected}\nQuantity Requested: ${quantityRequested}`);

    if (quantityRequested <= stockQuantityOfItemSelected) {
      console.log("The quantity that you selected can be honored!")
      makePurchase();
    } else {
      console.log(`Unfortunately we only have ${stockQuantityOfItemSelected} in stock.\nWould you like to take the ${stockQuantityOfItemSelected} that we have in stock?`);
      //INSERT INQUIRER PROMPT
    }
   
  });
  // //Check to see if the user want to exit.
  // function exit() {
  //   console.log(`Thank you for shopping with us.  Please visit us again!`);
  //   connection.end();
  // }
};
