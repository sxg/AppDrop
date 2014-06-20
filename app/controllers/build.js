//    Dependencies
var express = require('express');
var build = require('../models/build');

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

//    /builds
buildsRouter.route('/builds')
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

//    /builds/:build_id
buildsRouter.route('/builds/:build_id')
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
