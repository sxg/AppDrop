//    Dependencies
var assert = require('assert');
var db = require('../db/db');

//    Constants
var PUBLIC_FIELDS = ['app_id', 'bundle_id', 'name', 'uuid', 'account_id', 'created_at'];

//    app:
//        required: name, bundle_id
//        optional: private, password_hash
//        optional: account_id
//    cb(err, createdApp)
var createApp = function(app, cb) {
    db.create(db.app, app, PUBLIC_FIELDS, cb);
};

//    cb(err, apps)
var getAllApps = function(cb) {
    db.retrieveAll(db.app, PUBLIC_FIELDS, cb);
};

//    cb(err, app)
var getApp = function(app_id, cb) {
    db.retrieveOne(db.app, db.app.app_id, app_id, PUBLIC_FIELDS, cb);
};

//    cb(err, app)
var updateApp = function(app_id, app, cb) {
    db.updateOne(db.app, db.app.app_id, app_id, app, PUBLIC_FIELDS, cb);
};

//    cb(err)
var deleteApp = function(app_id, cb) {
    db.destroyOne(db.app, db.app.app_id, app_id, PUBLIC_FIELDS, cb);
};

//    Public
module.exports = {
    createApp: createApp,
    getApp: getApp,
    getAllApps: getAllApps,
    updateApp: updateApp,
    deleteApp: deleteApp
};
