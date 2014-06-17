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

appsRouter.route(API_PREFIX + '/apps/:bundle_identifier')
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
