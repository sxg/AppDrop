//    Dependencies
var db = require('../db/db');

//    Constants
var LIMIT = 1000;

//    app:
//        required: name, bundle_identifier
//        optional: private, password_hash
//        optional: account_id
//    cb(err, createdApp)
var createApp = function(app, cb) {
    //    Check for required values
    if (!app.name) {
        cb('Error: app requires a name');
    } else if (!app.bundle_identifier) {
        cb('Error: app requires a bundle identifier');
    } else {
        db.getClient(function(client, done) {
            //    Create the new app
            var q = db.app.insert(app).returning('bundle_identifier', 'name', 'uuid', 'account_id').toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                if (err) {
                    cb('Error creating app: ' + err);
                } else {
                    cb(null, results.rows[0]);
                }
            });
        });
    }
};

//    cb(err, apps)
var getAllApps = function(cb) {
    db.getClient(function(client, done) {
        //    Get apps
        var q = db.app.select('bundle_identifier', 'name', 'uuid', 'account_id')
                      .from(db.app)
                      .limit(LIMIT)
                      .toQuery();
        client.query(q.text, q.values, function(err, results) {
            done();
            if (err) {
                cb('Error getting apps: ' + err);
            } else {
                cb(null, results.rows);
            }
        });
    });
};

//    cb(err, app)
var getApp = function(bundle_identifier, cb) {
    //    Make sure there is a bundle ID
    if (!bundle_identifier) {
        cb('Error: app requires a bundle identifier');
    } else {
        db.getClient(function(client, done) {
            //    Get the app by bundle ID
            var q = db.app.select('bundle_identifier', 'name', 'uuid', 'account_id')
                          .from(db.app)
                          .where(db.app.bundle_identifier.equals(bundle_identifier))
                          .toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                if (err) {
                    cb('Error getting app: ' + err);
                } else {
                    //    If no app is found, just return an empty object
                    cb(null, results.rows[0] || {});
                }
            });
        });
    }
};

//    Public
module.exports = {
    createApp: createApp,
    getApp: getApp,
    getAllApps: getAllApps
};
