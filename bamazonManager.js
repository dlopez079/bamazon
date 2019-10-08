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
});
//END OF CONNECTION FUNCTION**************************************

//FUNCTION FOR MANAGER MENU
function managerMenu() {
    console.log("                                                                                                                      ");
    console.log("**********************************************************************************************************************");
    console.log("                                                                                                                      ");
    console.log("                                               Welcome Bamazon Manager!!!                                             ");
    console.log("                                           What would you like to do today?                                           ");
    console.log("                                                                                                                      ");
    console.log("**********************************************************************************************************************");
    console.log("                                                                                                                      ");

    inquirer
        .prompt({
            name: "menu",
            type: "checkbox",
            message: "What would you like to do today?",
            choices: ["View Products for Sale", "View Low Invetory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            // console.log(answer.menu); Confirmed that Answer function is working.
            switch (answer.menu) {
                
                //Switch statement to take users input and direct to correct function
                case "View Products for Sale":
                    console.log("You chose View Products for Sale.");
                    readProducts();
                    break;

                case "View Low Inventory":
                    // lowInventory();
                    break;

                case "Add to Inventory":
                    // addInventory();
                    break;

                case "Add New Product":
                    // newProduct();
                    break;

                default:
                    connection.end();
            }
        });
        
}

managerMenu();


//DISPLAY ALL ITEMS FOR SALE**************************************  
function readProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
    });
};
//END OF READPRODUCTS FUNCTION************************************

//CREATE LOWINVENTORY FUNCTION****************************


//CREATE ADDINVENTORY FUNCTION****************************


//CREATE NEWPRODUCT FUNCTION******************************