//    Dependencies
var db = require('../../config/db');

//    Constants
var PUBLIC_FIELDS = ['build_id',
                     'build_number',
                     'version',
                     'bundle_id',
                     'download_count',
                     'created_at',
                     'downloaded_last_at'];
var LIMIT = 1000;

//=========
//    CRUD
//=========

//    build:
//        required: build_number, version, bundle_id
//    cb(err, build)
var createBuild = function(build, cb) {
    db.create(db.build, build, PUBLIC_FIELDS, cb);
};

var getAllBuilds = function(cb) {
    db.retrieveAll(db.build, PUBLIC_FIELDS, cb);
};

var getBuild = function(build_id, cb) {
    db.retrieveOne(db.build, [db.build.build_id], [build_id], PUBLIC_FIELDS, cb);
};

var updateBuild = function(build_id, build, cb) {
    db.updateOne(db.build, [db.build.build_id], [build_id], build, PUBLIC_FIELDS, cb);
};

var deleteBuild = function(build_id, cb) {
    db.destroyOne(db.build, [db.build.build_id], [build_id], PUBLIC_FIELDS, cb);
};

//    Public
module.exports = {
    createBuild: createBuild,
    getAllBuilds: getAllBuilds,
    getBuild: getBuild,
    updateBuild: updateBuild,
    deleteBuild: deleteBuild
};
