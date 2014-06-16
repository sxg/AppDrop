//    Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var appsRouter = require('./routers/apps-router');

//    Constants
var PORT = process.env.PORT;

//    Setup
var app = express();
app.use(bodyParser());
app.use(appsRouter);
// app.use(function(req, res, next) {
//     console.log(req.host + req.path);
//     next();
// });

//    Start the server
app.listen(PORT, function() {
    console.log("Listening on port " + PORT + "...");
});
