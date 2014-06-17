//    Dependencies
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
    if (!app.name) {
        cb('Error: app requires a name');
    } else if (!app.bundle_id) {
        cb('Error: app requires a bundle identifier');
    } else {
        db.getClient(function(client, done) {
            //    Create the new app
            var q = db.app.insert(app).returning('app_id', 'bundle_id', 'name', 'uuid', 'account_id').toQuery();
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
    });
};

//    cb(err, app)
var getApp = function(app_id, cb) {
    //    Make sure there is an app ID
    if (!app_id) {
        cb('Error: app ID is required');
    } else {
        db.getClient(function(client, done) {
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
        });
    }
};

//    cb(err, app)
var updateApp = function(app_id, app, cb) {
    //    Make sure there is an app ID
    if (!app_id) {
        cb('Error: app ID is required');
    } else {
        db.getClient(function(client, done) {
            //    Update the app by app ID
            var q = db.app.update(app)
                          .where(db.app.app_id.equals(app_id))
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
        });
    }
};

//    cb(err)
var deleteApp = function(app_id, cb) {
    //    Make sure there is an app ID
    if (!app_id) {
        cb('Error: app ID is required');
    } else {
        db.getClient(function(client, done) {
            //    Delete the app by app ID
            var q = db.app.delete()
                          .from(db.app)
                          .where(db.app.app_id.equals(app_id))
                          .toQuery();
            client.query(q.text, q.values, function(err) {
                done();
                if (err) {
                    cb('Error getting app: ' + err);
                } else {
                    cb(null);
                }
            });
        });
    }
};

//    Public
module.exports = {
    createApp: createApp,
    getApp: getApp,
    getAllApps: getAllApps,
    updateApp: updateApp,
    deleteApp: deleteApp
};
