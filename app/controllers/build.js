//    Dependencies
var build = require('../models/build');


//===============
//    Operations
//===============

//    builds may be an Object or an Array
var respond = function(err, builds, res) {
    if (err) {
        res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
    } else {
        res.json(builds);
    }
};

var create = function(req, res) {
    build.createBuild(req.body, function(err, build) {
        respond(err, build, res);
    });
};

var getAll = function(req, res) {
    build.getAllBuilds(function(err, builds) {
        respond(err, builds, res);
    });
};

var getOne = function(req, res) {
    build.getBuild(req.account.account_id, req.params.buildID, function(err, build) {
        respond(err, build, res);
    });
};

var update = function(req, res) {
    build.updateBuild(req.account.account_id, req.params.buildID, req.body, function(err, build) {
        respond(err, build, res);
    });
};

var destroy = function(req, res) {
    build.deleteBuild(req.account.account_id, req.params.buildID, function(err, build) {
        respond(err, build, res);
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
