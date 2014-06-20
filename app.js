//    Dependencies
var express = require('express');
var connect = require('connect');
var appsRouter = require('./app/controllers/app');
var accountsRouter = require('./app/controllers/account');
var buildsRouter = require('./app/controllers/build');

//    Constants
var PORT = process.env.PORT;

//    Setup
var app = express();
app.use(connect.logger({format: 'dev'}));
app.use(connect.json());
app.use(connect.urlencoded());
app.use(appsRouter);
app.use(accountsRouter);
app.use(buildsRouter);


//=====================
//    Start the server
//=====================

app.listen(PORT, function() {
    console.log("Listening on port " + PORT + "...");
});
