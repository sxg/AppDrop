//    Dependencies
var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');

//    Constants
var DATABASE_URL = process.env.DATABASE_URL || 'postgres://Satyam:@localhost:5432/smuggledb';
var PORT = process.env.PORT || 5000;
var API_PREFIX = '/api/v1';

//    Setup
var app = express();
app.use(bodyParser());
var router = express.Router();

router.get('/', function(req, res) {
    pg.connect(DATABASE_URL, function(err, client, done) {
        if (err) {
            return console.error('Error fetching client from pool: ' + err);
        }
        client.query('SELECT * FROM app', function(err, result) {
            done();
            if (err) {
                return console.error('Error running query: ' + err);
            }
            res.send(JSON.stringify(result.rows[0]));
        });
    });
});

//    Register routes
app.use(API_PREFIX, router);

//    Start the server
app.listen(PORT, function() {
    console.log("Listening on port " + PORT + "...");
});
