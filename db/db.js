//    Dependencies
var pg = require('pg');

//    Constants
var DATABASE_URL = process.env.DATABASE_URL;

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
    getClient: getClient
};
