//    Dependencies
var express = require('express');
var connect = require('connect');
var router = require('./config/routes');

//    Constants
var PORT = process.env.PORT;

//    Setup middleware
var app = express();
app.use(connect.logger({format: 'dev'}));
app.use(connect.json());
app.use(connect.urlencoded());

//    Setup router
app.use(router);


//=====================
//    Start the server
//=====================

app.listen(PORT, function() {
    console.log("Listening on port " + PORT + "...");
});
