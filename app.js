//    Dependencies
var express = require('express');
var connect = require('connect');
var auth = require('./middleware/authentication');
var appsController = require('./app/controllers/app');
var accountsController = require('./app/controllers/account');
var buildsController = require('./app/controllers/build');
var authController = require('./app/controllers/authentication');

//    Constants
var PORT = process.env.PORT;
var API_V1 = '/api/v1';

//    Setup middleware
var app = express();
app.use(connect.logger({format: 'dev'}));
app.use(connect.json());
app.use(connect.urlencoded());
app.use(API_V1, auth());

//    Setup controllers
app.use(API_V1, appsController);
app.use(API_V1, accountsController);
app.use(API_V1, buildsController);
app.use(authController);


//=====================
//    Start the server
//=====================

app.listen(PORT, function() {
    console.log("Listening on port " + PORT + "...");
});
