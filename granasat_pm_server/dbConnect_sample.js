'use strict'

var mysql = require("mysql")
var db = mysql.createPool({
    connectionLimit: 6,
    host: 'localhost',
    user: '[DB_USER_HERE]',
    password: '[DB_PASS_HERE]',
    database: 'granasatpartmanager',
    multipleStatements: true,
    dateStrings: ['DATE']
})


module.exports = db;


