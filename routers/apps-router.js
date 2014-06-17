//    Dependencies
var express = require('express');
var app = require('../models/app');

//    Constants
var DATABASE_URL = process.env.DATABASE_URL;
var API_V1 = '/api/v1';

//    Setup
var appsRouter = express.Router();

//===========
//    Routes
//===========

//    /api/v1/apps
appsRouter.route(API_V1 + '/apps')
.get(function(req, res) {
    app.getAllApps(function(err, apps) {
        if (err) {
            res.send(500, {'error': err});
        } else {
            res.json(apps);
        }
    });
})
.post(function(req, res) {
    app.createApp(req.body, function(err, app) {
        if (err) {
            res.send(500, {'error': err});
        } else {
            res.json(app);
        }
    });
});

//    /api/v1/apps/:bundle_identifier
appsRouter.route(API_V1 + '/apps/:bundle_identifier')
.get(function(req, res) {
    app.getApp(req.params.bundle_identifier, function(err, app) {
        if (err) {
            res.send(500, {'error': err});
        } else {
            res.json(app);
        }
    });
});

//    Public
module.exports = appsRouter;
