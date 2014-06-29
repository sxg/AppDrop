//    Dependencies
var app = require('../models/app');


//===============
//    Operations
//===============

//    apps may be an Object or an Array
var respond = function(err, apps, res) {
    if (err) {
        res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
    } else {
        res.json(apps);
    }
};

var create = function(req, res) {
    app.createApp(req.body, function(err, app) {
        respond(err, app, res);
    });
};

var getAll = function(req, res) {
    app.getAllApps(function(err, apps) {
        respond(err, apps, res);
    });
};

var getOne = function(req, res) {
    app.getApp(req.account, req.params.appID, function(err, app) {
        respond(err, app, res);
    });
};

var update = function(req, res) {
    app.updateApp(req.account, req.params.appID, req.body, function(err, app) {
        respond(err, app, res);
    });
};

var destroy = function(req, res) {
    app.destroyApp(req.account, req.params.appID, function(err, app) {
        respond(err, app, res);
    });
};

//    Public
module.exports = {
    create: create,
    getAll: getAll,
    getOne: getOne,
    update: update,
    destroy: destroy
};
