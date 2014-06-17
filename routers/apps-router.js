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

//    /api/v1/apps/:app_id
appsRouter.route(API_V1 + '/apps/:app_id')
.get(function(req, res) {
    app.getApp(req.params.app_id, function(err, app) {
        if (err) {
            res.send(500, {'error': err});
        } else {
            res.json(app);
        }
    });
})
.put(function(req, res) {
    app.updateApp(req.params.app_id, req.body, function(err, app) {
        if (err) {
            res.send(500, {'error': err});
        } else {
            res.json(app);
        }
    });
})
.delete(function(req, res) {
    app.deleteApp(req.params.app_id, function(err) {
        if (err) {
            res.send(500, {'error': err});
        } else {
            res.send(204);
        }
    });
});

//    Public
module.exports = appsRouter;
