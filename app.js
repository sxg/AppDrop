//    Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var router = require('./router');

//    Constants
var PORT = process.env.PORT || 5000;

//    Setup
var app = express();
app.use(bodyParser());
app.use(router);

//    Start the server
app.listen(PORT, function() {
    console.log("Listening on port " + PORT + "...");
});
