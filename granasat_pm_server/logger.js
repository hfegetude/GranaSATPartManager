'use strict'

var moment = require('moment');
var colors = require('colors');

var logger = function() {};

logger.prototype.log = function(data, status) {
    data = data.toString()
    if (!status) {
        console.log(moment().format('DD/MM/YYYY HH:mm:ss').gray + ' -> '.gray + data.gray);
    } else if (status == 'error') {
        console.log(moment().format('DD/MM/YYYY HH:mm:ss').gray + ' -> '.gray + data.red);
    } else if (status == 'warning') {
        console.log(moment().format('DD/MM/YYYY HH:mm:ss').gray + ' -> '.gray + data.yellow.bold);
    }
}

logger.prototype.error = function(data) {
    data = data.toString()
    console.log(moment().format('DD/MM/YYYY HH:mm:ss').gray + ' -> '.gray + data.red);
}



module.exports = new logger();
