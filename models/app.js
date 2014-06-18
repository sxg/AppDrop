//    Dependencies
var assert = require('assert');
var db = require('../db/db');

//    Constants
var LIMIT = 1000;

//    app:
//        required: name, bundle_id
//        optional: private, password_hash
//        optional: account_id
//    cb(err, createdApp)
var createApp = function(app, cb) {
    //    Check for required values
    assert.equal(typeof app.name, 'string', 'name must be a string');
    assert.equal(typeof app.bundle_id, 'string', 'bundle_id must be a string');

    db.getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Create the new app
            var q = db.app.insert(app)
                          .returning('app_id', 'bundle_id', 'name', 'uuid', 'account_id')
                          .toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                if (err) {
                    cb('Error creating app: ' + err);
                } else {
                    cb(null, results.rows[0]);
                }
            });
        }
    });
};

//    cb(err, apps)
var getAllApps = function(cb) {
    db.getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Get apps
            var q = db.app.select('app_id', 'bundle_id', 'name', 'uuid', 'account_id')
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
        }
    });
};

//    cb(err, app)
var getApp = function(app_id, cb) {
    //    Make sure there is an app ID
    assert.equal(typeof app_id, 'string', 'app_id must be a string');

    db.getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Get the app by app ID
            var q = db.app.select('app_id', 'bundle_id', 'name', 'uuid', 'account_id')
                          .from(db.app)
                          .where(db.app.app_id.equals(app_id))
                          .toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                if (err) {
                    cb('Error getting app: ' + err);
                } else if (results.rows.length === 0) {
                    cb('Error getting app: no app with app ID ' + app_id + ' exists');
                } else {
                    cb(null, results.rows[0]);
                }
            });
        }
    });
};

//    cb(err, app)
var updateApp = function(app_id, app, cb) {
    //    Make sure there is an app ID
    assert.equal(typeof app_id, 'string', 'app_id must be a string');

    db.getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Update the app by app ID
            var q = db.app.update(app)
                          .where(db.app.app_id.equals(app_id))
                          .returning('app_id', 'bundle_id', 'name', 'uuid', 'account_id')
                          .toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                if (err) {
                    cb('Error updating app: ' + err);
                } else {
                    cb(null, results.rows[0]);
                }
            });
        }
    });
};

//    cb(err)
var deleteApp = function(app_id, cb) {
    //    Make sure there is an app ID
    assert.equal(typeof app_id, 'string', 'app_id must be a string');
    
    db.getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Delete the app by app ID
            var q = db.app.delete()
                          .from(db.app)
                          .where(db.app.app_id.equals(app_id))
                          .toQuery();
            client.query(q.text, q.values, function(err) {
                done();
                if (err) {
                    cb('Error deleting app: ' + err);
                } else {
                    cb(null);
                }
            });
        }
    });
};

//    Public
module.exports = {
    createApp: createApp,
    getApp: getApp,
    getAllApps: getAllApps,
    updateApp: updateApp,
    deleteApp: deleteApp
};
