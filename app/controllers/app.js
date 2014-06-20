//    Dependencies
var express = require('express');
var app = require('../models/app');

//    Constants
var API_V1 = '/api/v1';

//    Setup
var appsRouter = express.Router();


//===========
//    Routes
//===========

//    apps may be an Object or an Array
var respond = function(err, apps, res) {
    if (err) {
        res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
    } else {
        res.json(apps);
    }
};

//    /api/v1/apps
appsRouter.route(API_V1 + '/apps')
.get(function(req, res) {
    app.getAllApps(function(err, apps) {
        respond(err, apps, res);
    });
})
.post(function(req, res) {
    app.createApp(req.body, function(err, app) {
        respond(err, app, res);
    });
});

//    /api/v1/apps/:app_id
appsRouter.route(API_V1 + '/apps/:app_id')
.get(function(req, res) {
    app.getApp(req.params.app_id, function(err, app) {
        respond(err, app, res);
    });
})
.put(function(req, res) {
    app.updateApp(req.params.app_id, req.body, function(err, app) {
        respond(err, app, res);
    });
})
.delete(function(req, res) {
    app.deleteApp(req.params.app_id, function(err, app) {
        respond(err, app, res);
    });
});

//    Public
module.exports = appsRouter;