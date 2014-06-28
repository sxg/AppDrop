//    Dependencies
var db = require('../../config/db');

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
    db.getAll(db.app, PUBLIC_FIELDS, cb);
};

//    cb(err, app)
var getApp = function(requestingAccount, appID, cb) {
    db.getOne(db.app, [db.app.account_id, db.app.app_id], [requestingAccount.account_id, appID], PUBLIC_FIELDS, cb);
};

//    cb(err, app)
var updateApp = function(requestingAccount, appID, app, cb) {
    db.update(db.app, [db.app.account_id, db.app.app_id], [requestingAccount.account_id, appID], app, PUBLIC_FIELDS, cb);
};

//    cb(err)
var deleteApp = function(requestingAccount, appID, cb) {
    db.destroy(db.app, [db.app.account_id, db.app.app_id], [requestingAccount.account_id, appID], PUBLIC_FIELDS, cb);
};

//    Public
module.exports = {
    createApp: createApp,
    getApp: getApp,
    getAllApps: getAllApps,
    updateApp: updateApp,
    deleteApp: deleteApp
};
