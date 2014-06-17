//    Dependencies
var pg = require('pg');
var sql = require('sql');

//    Constants
var DATABASE_URL = process.env.DATABASE_URL;

//    Tables
var app = sql.define({
    name: 'app',
    columns: ['app_id', 'bundle_id', 'name', 'uuid', 'private', 'password_hash', 'account_id']
});

var build = sql.define({
    name: 'build',
    columns: ['build_number', 'version', 'path', 'uploaded_at', 'downloaded_last_at', 'download_count', 'bundle_id']
});

var account = sql.define({
    name: 'account',
    columns: ['account_id', 'name', 'email', 'password_hash']
});

//    Helpers
var getClient = function(cb) {
    pg.connect(DATABASE_URL, function(err, client, done) {
        if (err) {
            console.log('Error: couldn\'t fetch client from client pool:' + err);
            throw err;
        }
        cb(client, done);
    });
};

//    Public
module.exports = {
    app: app,
    build: build,
    account: account,
    getClient: getClient
};
