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

connection.query('SELECT * FROM products', async function(err, res) {
    if (err) throw err
    afterConnection(res)
    await inquirer.prompt([
        {
            name: 'product',
            message: 'Which item would you like to buy? (Choose an item_id)'
        }, {
            name: 'quantity',
            message: 'How many of these would you like to buy?'
        }
    ]) .then(function(response) {
        let choice = parseInt(response.product - 1)

        if (res[choice].stock_quantity < response.quantity) {
            console.log('Insufficent Product!')
        } else {
            let newQuantity = parseInt(res[choice].stock_quantity - response.quantity)
            let total = parseFloat(res[choice].price * response.quantity).toFixed(2)

            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newQuantity, response.product],
            function(err) {
                if (err) throw err;
                console.log(`Order Placed! Your total is $${total}`)
            })
            connection.query('UPDATE products SET product_sales = ? WHERE item_id = ?', [total, response.product], function(err) {
                if (err) throw err;
            })
        }
    })
    connection.end()
})






function afterConnection(res) {
    console.table(res, ['item_id', 'product_name', 'price',])
}