//    Dependencies
var pg = require('pg');
var sql = require('sql');

//    Constants
var DATABASE_URL = process.env.DATABASE_URL;

//    Tables
var app = sql.define({
    name: 'app',
    columns: ['bundle_identifier', 'name', 'uuid', 'private', 'password_hash', 'account_id']
});

var getClient = function(cb) {
    pg.connect(DATABASE_URL, function(err, client, done) {
        if (err) {
            console.log('Error fetching client from client pool:' + err);
        }
        cb(err, client, done);
    });
};

//    Public
module.exports = {
    app: app,
    getClient: getClient
};
