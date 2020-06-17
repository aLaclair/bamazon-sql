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
        type:'list',
        name:'choice',
        message: 'Select an option:',
        choices: [
            {name:'View Product Sales by Department', value:'view'},
            {name:'Create New Department', value:'create'}
        ]
    }
]).then(function(answers) {
    if(answers.choice === 'view') {
        let query = 'SELECT d.department_id, d.department_name, d.over_head_costs, '+
        'SUM(products.product_sales) AS product_sales, '+
        '(product_sales - over_head_costs) AS total_profit' +
        ' FROM departments d INNER JOIN products ON'+
        ' d.department_name=products.department_name' +
        ' GROUP BY department_name'+
        ' ORDER BY department_id;'

        connection.query(query, function(err, res) {
            if(err) throw err
            console.table(res)
            connection.end()
        })
    } else {
        inquirer.prompt([
            {
                name: 'name',
                message: 'What is the name of this department?'
            }, {
                name: 'costs',
                message: 'What are the over head costs?'
            }
        ]) .then(function(response) {
            connection.query('INSERT INTO departments '+
            '(department_name, over_head_costs) Values (?,?)',
            [response.name, response.costs], function(err) {
                if (err) throw err;
                console.log('Department added!')
                connection.end()
            })
        })
    }
})