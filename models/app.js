//    Dependencies
var db = require('../db/db');

//    app:
//        required: name, bundleID
//        optional: accountID
//    cb(err, createdApp)
var createPublicApp = function(app, cb) {
    if (!app.name) {
        cb('Error: app requires a name');
    } else if (!app.bundleID) {
        cb('Error: app requires a bundle identifier');
    } else {
        db.getClient(function(err, client, done) {
            var insertCB = function(err, results) {
                done();
                if (err) {
                    cb('Error creating app: ' + err);
                } else {
                    cb(null, results.rows[0]);
                }
            };

            if (!app.accountID) {
                client.query('INSERT INTO app(name, bundle_identifier, uuid) VALUES($1, $2, uuid_generate_v4()) RETURNING uuid', [app.name, app.bundleID], insertCB);
            } else {
                client.query('INSERT INTO app(name, bundle_identifier, account_id, uuid) VALUES($1, $2, $3, uuid_generate_v4()) RETURNING uuid', [app.name, app.bundleID, app.accountID], insertCB);
            }
        });
    }
};

//    Public
module.exports = {
    createPublicApp: createPublicApp
};
