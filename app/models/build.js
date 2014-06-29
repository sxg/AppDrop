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

var getBuild = function(requestingAccount, buildID, cb) {
    var cols = [db.build.build_id];
    var vals = [buildID];
    if (requestingAccount.permission === 'user') {
        cols.push(db.build.account_id);
        vals.push(requestingAccount.account_id);
    }
    db.getOne(db.build, cols, vals, PUBLIC_FIELDS, cb);
};

var updateBuild = function(requestingAccount, buildID, build, cb) {
    var cols = [db.build.build_id];
    var vals = [buildID];
    if (requestingAccount.permission === 'user') {
        cols.push(db.build.account_id);
        vals.push(requestingAccount.account_id);
    }
    db.update(db.build, cols, vals, build, PUBLIC_FIELDS, cb);
};

var destroyBuild = function(requestingAccount, buildID, cb) {
    var cols = [db.build.build_id];
    var vals = [buildID];
    if (requestingAccount.permission === 'user') {
        cols.push(db.build.account_id);
        vals.push(requestingAccount.account_id);
    }
    db.destroy(db.build, cols, vals, PUBLIC_FIELDS, cb);
};

//    Public
module.exports = {
    createBuild: createBuild,
    getAllBuilds: getAllBuilds,
    getBuild: getBuild,
    updateBuild: updateBuild,
    destroyBuild: destroyBuild
};
