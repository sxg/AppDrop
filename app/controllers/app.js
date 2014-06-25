//    Dependencies
var express = require('express');
var app = require('../models/app');
var perm = require('../../middleware/permission');

//    Constants
var GENERAL_ROUTE = '/apps';
var SPECIFIC_ROUTE = '/apps/:app_id';

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

//    /apps
appsRouter
.route(GENERAL_ROUTE)
.get(perm.needMinLevel(perm.levels.ADMIN), function(req, res) {
    app.getAllApps(function(err, apps) {
        respond(err, apps, res);
    });
})
.post(function(req, res) {
    app.createApp(req.body, function(err, app) {
        respond(err, app, res);
    });
});

//    /apps/:app_id
appsRouter
.use(SPECIFIC_ROUTE, perm.needToOwnAccount())
.route(SPECIFIC_ROUTE)
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
