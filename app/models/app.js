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
    var cols = [db.app.app_id];
    var vals = [appID];
    if (requestingAccount.permission === 'user') {
        cols.push(db.app.account_id);
        vals.push(requestingAccount.account_id);
    }
    db.getOne(db.app, cols, vals, PUBLIC_FIELDS, cb);
};

//    cb(err, app)
var updateApp = function(requestingAccount, appID, app, cb) {
    var cols = [db.app.app_id];
    var vals = [appID];
    if (requestingAccount.permission === 'user') {
        cols.push(db.app.account_id);
        vals.push(requestingAccount.account_id);
    }
    db.update(db.app, cols, vals, app, PUBLIC_FIELDS, cb);
};

//    cb(err)
var destroyApp = function(requestingAccount, appID, cb) {
    var cols = [db.app.app_id];
    var vals = [appID];
    if (requestingAccount.permission === 'user') {
        cols.push(db.app.account_id);
        vals.push(requestingAccount.account_id);
    }
    db.destroy(db.app, cols, vals, PUBLIC_FIELDS, cb);
};

//    Public
module.exports = {
    createApp: createApp,
    getApp: getApp,
    getAllApps: getAllApps,
    updateApp: updateApp,
    destroyApp: destroyApp
};
