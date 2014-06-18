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

    db.getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Create the build
            var q = db.build.insert(build)
                            .returning('build_id', 'build_number', 'version', 'bundle_id', 'download_count', 'uploaded_at', 'downloaded_last_at')
                            .toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                if (err) {
                    if (err.code == 23505) {
                        err.name = 'ConflictError';
                        err.message = 'build_number must be unique';
                        err.httpStatusCode = 409;
                    } else if (err.code == 23503) {
                        err.name = 'BadRequestError';
                        err.message = 'the bundle_id given does not exist';
                        err.httpStatusCode = 400;
                    }
                    cb(err);
                } else {
                    cb(null, results.rows[0]);
                }
            });
        }
    });
};

//    Public
module.exports = {
    createBuild: createBuild
};
