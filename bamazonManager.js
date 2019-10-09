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
            type: "list",
            message: "What would you like to do today?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            // console.log(answer.menu); //Confirmed that Answer function is working.

            switch (answer.menu) {

                //Switch statement to take users input and direct to correct function
                case "View Products for Sale":
                    console.log("You chose View Products for Sale.");
                    readProducts();
                    break;

                case "View Low Inventory":
                    console.log("Low Inventory");
                    // connection.end();
                    lowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    // console.log("Add New Product");
                    connection.end();
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
    connection.end();
};
//END OF READPRODUCTS FUNCTION************************************

//CREATE LOWINVENTORY FUNCTION************************************
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 6", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        if (res) {
            console.table(res);
        } else {
            console.log("There are no items with low inventory!");
        };
    });
    connection.end();
};
//END OF THE LOWINVENTORY FUNCTION********************************

//CREATE ADDINVENTORY FUNCTION************************************
function addInventory() {
    // prompt for info about item being added to inventory
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "Which product would you like to select?"
            },


        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "SELECT * FROM products WHERE = ?", [answer.product], function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    // re-prompt the user for quantity of product
                    inquirer
                        .prompt([
                            {
                                name: "quantity",
                                type: "number",
                                message: "How much would you like to add?"
                            },
                        ])
                        .then(function (answer) {
                            //Use the quantity entered by user to add to existing quantity.
                            let newItems = parseInt(answer.quantity);
                            let stock = parseInt(answer.stock_quantity);
                            let newInv = newItems + stock;
                            connection.query(
                                "UPDATE stock_quantity FROM products WHERE = ?", [newInv], function (err, res) {
                                    if (err) throw err;

                                    //add exit function or end connection.
                                    connection.end();
                                })

                            connection.query(
                                "UPDATE INTO products SET ?",
                                {
                                    product_name: answer.product,
                                },
                                function (err) {
                                    if (err) throw err;
                                    console.log("Your product was created successfully!");
                                    // re-prompt the user for if they want to bid or post

                                    //add exit function or end connection.
                                    connection.end();
                                }
                            );
                        });
                });
            
            //CREATE NEWPRODUCT FUNCTION**************************************
            function newProduct() {
                // prompt for info about item being added to inventory
                inquirer
                    .prompt([
                        {
                            name: "product",
                            type: "input",
                            message: "What is the name of the product?"
                        },
                        {
                            name: "department",
                            type: "input",
                            message: "What department does this item belong to?"
                        },
                        {
                            name: "price",
                            type: "number",
                            message: "What is the price of this product?"
                        },
                        {
                            name: "stock",
                            type: "number",
                            message: "How many products are you adding to inventory? "
                        },

                    ])
                    .then(function (answer) {
                        // when finished prompting, insert a new item into the db with that info
                        connection.query(
                            "INSERT INTO products SET ?",
                            {
                                product_name: answer.product,
                                department_name: department,
                                price: answer.price || 0,
                                stock_quantity: answer.stock || 0
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Your product was created successfully!");
                                // re-prompt the user for if they want to bid or post

                                //add exit function or end connection.
                                connection.end();
                            }
                    );
                    })}