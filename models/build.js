//    Dependencies
var assert = require('assert');
var db = require('../db/db');

//    Constants
var LIMIT = 1000;

//    build:
//        required: build_number, version, bundle_id
//    cb(err, build)
var createBuild = function(build, cb) {
    //    Check for required values
    assert.equal(typeof build.build_number, 'string', 'build_number must be a string');
    assert.equal(typeof build.version, 'string', 'version must be a string');
    assert.equal(typeof build.bundle_id, 'string', 'bundle_id must be a string');
    assert.equal(typeof cb, 'function', 'cb must be a function');

    //    Create the build
    var returningColumns = ['build_id',
                            'build_number',
                            'version',
                            'bundle_id',
                            'download_count',
                            'uploaded_at',
                            'downloaded_last_at'];
    db.create(db.build, build, returningColumns, function(err, build) {
        if (err) {
            cb(err);
        } else {
            cb(null, build);
        }
    });
};

//    Public
module.exports = {
    createBuild: createBuild
};
