//    Dependencies
var express = require('express');
var pg = require('pg');

//    Constants
var DATABASE_URL = process.env.DATABASE_URL || 'postgres://Satyam:@localhost:5432/smuggledb';
var API_PREFIX = '/api/v1';

//    Setup
var router = express.Router();
module.exports = router;

//    Routes
router.route(API_PREFIX)
.get(function(req, res) {
    pg.connect(DATABASE_URL, function(err, client, done) {
        if (err) {
            return console.error('Error fetching client from pool: ' + err);
        }
        client.query('SELECT * FROM app', function(err, result) {
            done();
            if (err) {
                return console.error('Error running query: ' + err);
            }
            res.json(result.rows[0]);
        });
    });
});
