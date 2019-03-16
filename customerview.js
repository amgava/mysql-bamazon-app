//Required Modules
const mysql = require('mysql');
const Table = require('cli-table3');
const inquirer = require('inquirer');

//Initializing connection to database
const dbconnect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'rootroot',
  database: 'bamazon'
});

//Connecting to database
dbconnect.connect(function(err) {
  if (err) {
    console.error('error connecting to database');
    return;
  }

  console.log('\n Database connected. Welcome to Bamazon. \n');
});

//Display database as table
dbconnect.query('SELECT * FROM products', function(err, result) {
  if (err) throw err;

  var table = new Table({
    head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity']
  });
  for (var i = 0; i < result.length; i++) {
    table.push(
      [result[i].item_id, result[i].product_name, result[i].department_name, '$'+ result[i].price, result[i].stock_quantity]);
    }
  console.log(table.toString() + '\n');
  runSale();
  }
);

//Defining function to prompt customer to make purchase selection,
//show price of selection, update database to reflect purchase
function runSale(){
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'requested_item',
      message: 'Please enter ID of the product you wish to purchase:'
    },
    {
      type: 'input',
      name: 'requested_units',
      message: 'Please enter number of units you would like to purchase:'
    }
  ])
  .then(answer => {
    var item = answer.requested_item.toUpperCase();
    var unit = answer.requested_units;
    var iWant = 'SELECT * FROM products WHERE item_id = ?';

    dbconnect.query(iWant, [item], function (err, result) {
      if (err) throw err;

      else {
        if (result[0].stock_quantity < unit) {
          console.log("Purchase cannot be completed. Insufficient stock.");
          return;
        }
        else {
          var stockUpdate = result[0].stock_quantity - unit;
          var makePurchase = 'UPDATE products SET stock_quantity = ? WHERE item_id = ?';
          var orderTotal = result[0].price * unit;

          var orderTotalEn = orderTotal.toLocaleString();

          // var oT = orderTotal.toString();
          // var u = oT.slice(0, 2);
          // var v = oT.slice(2);
          // var upT;
          // console.log(oT);

          // if (oT.length >= 5) {
          //   upT = u + ',' + v;
          // } else {
          //   upT = orderTotal;
          // }



          dbconnect.query(makePurchase, [stockUpdate, item], function(err, response) {
            if (err) throw err;

            var output = [
              response.changedRows +' order(s) received.',
              'Your order total is $' + orderTotalEn,
              'Thank you for shopping with Bamazon.'
            ].join('\n');
            console.log(output);
          })
        }
      }
    })
  })
}