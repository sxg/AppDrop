//    Dependencies
var assert = require('assert');
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
            err.name = 'GatewayTimeoutError';
            err.message = 'a connection to the database could not be made';
            err.httpStatusCode = 504;
            cb(err);
        } else {
            cb(null, client, done);
        }
    });
};

var create = function(table, object, returningColumns, cb) {
    //    Check paramters
    assert.ok(table, 'table must be non null');
    assert.ok(object, 'object must be non null Object');
    assert.ok(returningColumns instanceof Array, 'returningColumns must must be an Array');
    assert.ok(cb instanceof Function, 'cb must be a Function');

    getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Create the object in the database
            var q = table.insert(object).returning(returningColumns).toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                if (err) {
                    if (err.code == 23505) {
                        err.name = 'ConflictError';
                        err.message = 'a field required to be unique is not unique';
                        err.httpStatusCode = 409;
                    } else if (err.code == 23503) {
                        err.name = 'BadRequestError';
                        err.message = 'a foreign key given does not exist';
                        err.httpStatusCode = 400;
                    }
                    cb(err);
                } else {
                    cb(null, results.rows[0]);
                }
            });
        }
    });
};

var destroyOne = function(table, column, value, returningColumns, cb) {
    //    Check paramters
    assert.ok(table, 'table must be non null');
    assert.ok(column, 'column must be non null');
    assert.ok(/\w*_id/, 'column must be an id');    // id columns are unique, ensuring only one row gets deleted
    assert.ok(value, 'value must be non null');
    assert.ok(cb instanceof Function, 'cb must be a Function');

    getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Destroy the matching objects in the database
            var q = table.delete()
                         .from(table)
                         .where(column.equals(value))
                         .returning(returningColumns)
                         .toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                if (err) {
                    cb(err);
                } else if (results.rows.length === 0) {
                    err = new Error('NotFoundError');
                    err.message = 'no data exists where ' + column.name + ' == ' + value;
                    err.httpStatusCode = 404;
                    cb(err);
                } else {
                    cb(null, results.rows[0]);
                }
            });
        }
    });
};

//    Public
module.exports = {
    app: app,
    build: build,
    account: account,
    getClient: getClient,
    create: create,
    destroyOne: destroyOne
};
