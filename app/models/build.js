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
    db.getAll(db.build, PUBLIC_FIELDS, cb);
};

var getBuild = function(ownerAccountID, buildID, cb) {
    db.getOne(db.build, [db.build.account_id, db.build.build_id], [ownerAccountID, buildID], PUBLIC_FIELDS, cb);
};

var updateBuild = function(ownerAccountID, buildID, build, cb) {
    db.update(db.build, [db.build.account_id, db.build.build_id], [ownerAccountID, buildID], build, PUBLIC_FIELDS, cb);
};

var deleteBuild = function(ownerAccountID, buildID, cb) {
    db.destroy(db.build, [db.build.account_id, db.build.build_id], [ownerAccountID, buildID], PUBLIC_FIELDS, cb);
};

//    Public
module.exports = {
    createBuild: createBuild,
    getAllBuilds: getAllBuilds,
    getBuild: getBuild,
    updateBuild: updateBuild,
    deleteBuild: deleteBuild
};
