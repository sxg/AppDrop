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

buildsRouter.route(API_V1 + '/builds')
.post(function(req, res) {
    build.createBuild(req.body, function(err, build) {
        if (err) {
            res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            res.json(build);
        }
    });
});

//    Public
module.exports = buildsRouter;