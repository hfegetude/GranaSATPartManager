var path = require("path")

var express = require('express')
var app = express()

var helmet = require('helmet')
app.use(helmet())


var HOST = '127.0.0.1';
var WEBPORT = 9876;

app.use(require('./apiserver.js'));

// Default index webpage
app.get('*', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../granasat_pm_client/build/index.html')) 
});
 
// Run 
app.listen(WEBPORT, HOST);
console.log("App and API running on " + HOST + ":" + WEBPORT)
