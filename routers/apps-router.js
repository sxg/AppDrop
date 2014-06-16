//    Dependencies
var express = require('express');
var app = require('../models/app');

//    Constants
var DATABASE_URL = process.env.DATABASE_URL;
var API_PREFIX = '/api/v1';

//    Setup
var appsRouter = express.Router();

//    Routes
appsRouter.route(API_PREFIX + '/apps')
.post(function(req, res) {
    app.createApp(req.body, function(err, app) {
        if (err) {
            res.send(500, {'error': err});
        } else {
            res.json(app);
        }
    });
});

//    Public
module.exports = appsRouter;
