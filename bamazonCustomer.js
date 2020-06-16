require('dotenv').config()

var keys = require('./keys')

var inquirer = require('inquirer')

var mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: keys.keys.user,
    password: keys.keys.password
})

