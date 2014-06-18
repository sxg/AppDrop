//    Dependencies
var db = require('../db/db');

//    Constants
var LIMIT = 1000;

//    build:
//        required: build_number, version, bundle_id
//    cb(err, build)
var createBuild = function(build, cb) {
    //    Check for required values
    if (!build.build_number) {
        cb('Error: build number is required');
    } else if (!build.version) {
        cb('Error: version is required');
    } else if (!build.bundle_id) {
        cb('Error: bundle ID is required');
    } else {
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
                        cb('Error creating build: ' + err);
                    } else {
                        cb(null, results.rows[0]);
                    }
                });
            }
        });
    }
};

//    Public
module.exports = {
    createBuild: createBuild
};
