//    Dependencies
var express = require('express');
var build = require('../models/build');

//    Constants
var API_V1 = '/api/v1';

//    Setup
var buildsRouter = express.Router();


//===========
//    Routes
//===========

//    builds may be an Object or an Array
var respond = function(err, builds, res) {
    if (err) {
        res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
    } else {
        res.json(builds);
    }
};

//    /api/v1/builds
buildsRouter.route(API_V1 + '/builds')
.get(function(req, res) {
    build.getAllBuilds(function(err, builds) {
        respond(err, builds, res);
    });
})
.post(function(req, res) {
    build.createBuild(req.body, function(err, build) {
        respond(err, build, res);
    });
});

buildsRouter.route(API_V1 + '/builds/:build_id')
.get(function(req, res) {
    build.getBuild(req.params.build_id, function(err, build) {
        respond(err, build, res);
    });
})
.put(function(req, res) {
    build.updateBuild(req.params.build_id, req.body, function(err, build) {
        respond(err, build, res);
    });
})
.delete(function(req, res) {
    build.deleteBuild(req.params.build_id, function(err, build) {
        respond(err, build, res);
    });
});

//    Public
module.exports = buildsRouter;
