require('dotenv').config()

var keys = require('./keys')

var inquirer = require('inquirer')

var mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: keys.keys.user,
    password: keys.keys.password,
    database: 'bamazon'
})
inquirer.prompt([
    {
        type: 'list',
        name: 'choice',
        message: 'Select an option:',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }
]).then(function(response) {
    switch (response.choice) {
        case 'View Products for Sale':
            connection.query('SELECT * FROM products', function(err, res) {
                if (err) throw err;
                viewProducts(res)
            })
            connection.end()
        break;


        case 'View Low Inventory':
            connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
                if (err) throw err;
                viewProducts(res)
            })
            connection.end()
        break;
    

        case 'Add to Inventory':
            connection.query('SELECT * FROM products', async function(err, res) {
                if (err) throw err;
                let resArr = []
                for (let i = 0; i < res.length; i++) {
                    let product = `${res[i].item_id} | ${res[i].product_name} | ${res[i].price} | ${res[i].stock_quantity}`
                    resArr.push(product)
                }

            await inquirer.prompt([
                {
                    type: 'list',
                    name:'productChoice',
                    message: 'Which item would you like to add more of?',
                    choices: resArr
                }, {
                    name: 'quantity',
                    message: 'How many would you like to add?'
                }
            ]).then(function(answers) {
                let product = answers.productChoice
                let productArr = product.split('')
                let quantity = parseInt(answers.quantity)
                connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',
                [quantity, parseInt(productArr[0])],function(err) {
                    console.log('Product Added!')
                })
            })
            connection.end()
         })
        break;


        case 'Add New Product':
            inquirer.prompt([
                {
                    name: 'name',
                    message: 'What is the name of the new product?'
                }, {
                    name: 'department',
                    message: 'Which department is this in?'
                }, {
                    name: 'price',
                    message: 'How much will it cost?'
                }, {
                    name: 'quantity',
                    message: 'How many are you adding?'
                }
            ]) .then(function(answers) {
                connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)',
                [answers.name, answers.department, parseFloat(answers.price), parseInt(answers.quantity)], function(err) {
                    if (err) throw err;
                    console.log('Product Added!')
                })
                connection.end()
            })
            
        break;
    }
})


function viewProducts(res) {
    console.table(res, ['item_id', 'product_name', 'price', 'stock_quantity'])
}