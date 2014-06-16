//    Dependencies
var db = require('../db/db');

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
        db.getClient(function(err, client, done) {
            //    Callback after creating the app
            var insertCB = function(err, results) {
                done();
                if (err) {
                    cb('Error creating app: ' + err);
                } else {
                    cb(null, results.rows[0]);
                }
            };

            //    Create the new app
            var q = db.app.insert(app).returning('bundle_identifier', 'name', 'uuid', 'account_id').toQuery();
            client.query(q.text, q.values, insertCB);
        });
    }
};

//    Public
module.exports = {
    createPublicApp: createPublicApp
};
