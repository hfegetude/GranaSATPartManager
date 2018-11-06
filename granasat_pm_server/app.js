var express = require('express')
var app = express()

var helmet = require('helmet')
app.use(helmet())


var HOST = '127.0.0.1';
var WEBPORT = 8000;

app.use(require('./apiserver.js'));

// Default index webpage
app.get('*', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/app/index.html'))
});

// Run 
app.listen(WEBPORT, HOST);
console.log("App and API running on " + HOST + ":" + WEBPORT)
