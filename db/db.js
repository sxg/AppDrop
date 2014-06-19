//    Dependencies
var assert = require('assert');
var pg = require('pg');
var sql = require('sql');

//    Constants
var DATABASE_URL = process.env.DATABASE_URL;
var LIMIT = 1000;

//    Tables
var app = sql.define({
    name: 'app',
    columns: ['app_id', 'bundle_id', 'name', 'uuid', 'private', 'password_hash', 'account_id']
});

var build = sql.define({
    name: 'build',
    columns: ['build_id', 'build_number', 'version', 'path', 'uploaded_at', 'downloaded_last_at', 'download_count', 'bundle_id']
});

var account = sql.define({
    name: 'account',
    columns: ['account_id', 'name', 'email', 'password_hash', 'created_at', 'token_expires_at', 'token']
});


var getClient = function(cb) {
    pg.connect(DATABASE_URL, function(err, client, done) {
        if (err) {
            err.name = 'GatewayTimeoutError';
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
    assert.ok(object, 'object must be non null');
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
                    cb(handlePostgresError(err));
                } else {
                    cb(null, results.rows[0]);
                }
            });
        }
    });
};

var retrieveAll = function(table, returningColumns, cb) {
    //    Check parameters
    assert.ok(table, 'table must be non null');
    assert.ok(returningColumns instanceof Array, 'returningColumns must be an array');
    assert.ok(cb instanceof Function, 'cb must be a Function');

    getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Get up to LIMIT objects in the database
            var q = table.select(returningColumns)
                         .from(table)
                         .limit(LIMIT)
                         .toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();

                if (err) {
                    cb(handlePostgresError(err));
                } else {
                    cb(null, results.rows);
                }
            });
        }
    });
};

var retrieveOne = function(table, column, value, returningColumns, cb) {
    //    Check parameters
    assert.ok(table, 'table must be non null');
    assert.ok(column, 'column must be non null');
    assert.ok(/\w*_id/, 'column must be an id'); // id columns are unique, ensuring only one row gets updated
    assert.ok(value, 'value must be non null');
    assert.ok(returningColumns instanceof Array, 'returningColumns must be an array');
    assert.ok(cb instanceof Function, 'cb must be a Function');

    getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Get the object in the database
            var q = table.select(returningColumns)
                         .from(table)
                         .where(column.equals(value))
                         .toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                assert.ok(results === undefined || results.rows.length <= 1, 'no more than one row should be found for ' + column.name + ' == ' + value);

                if (err) {
                    cb(handlePostgresError(err));
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

var updateOne = function(table, column, value, object, returningColumns, cb) {
    //    Check parameters
    assert.ok(table, 'table must be non null');
    assert.ok(column, 'column must be non null');
    assert.ok(/\w*_id/, 'column must be an id'); // id columns are unique, ensuring only one row gets updated
    assert.ok(value, 'value must be non null');
    assert.ok(object, 'must be non null');
    assert.ok(returningColumns instanceof Array, 'returningColumns must be an array');
    assert.ok(cb instanceof Function, 'cb must be a Function');

    getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Update the object in the database
            //    Try/catch catches errors thrown in forming the SQL query due to bad input
            try {
                var q = table.update(object)
                             .where(column.equals(value))
                             .returning(returningColumns)
                             .toQuery();
                client.query(q.text, q.values, function(err, results) {
                    done();
                    assert.ok(results === undefined || results.rows.length <= 1, 'no more than one row should be found for ' + column.name + ' == ' + value);

                    if (err) {
                        cb(handlePostgresError(err));
                    } else if (results.rows.length === 0) {
                        err = new Error('NotFoundError');
                        err.message = 'no data exists where ' + column.name + ' == ' + value;
                        err.httpStatusCode = 404;
                        cb(err);
                    } else {
                        cb(null, results.rows[0]);
                    }
                });
            } catch (e) {
                e.httpStatusCode = 400;
                cb(e);
            }
        }
    });
};

var destroyOne = function(table, column, value, returningColumns, cb) {
    //    Check paramters
    assert.ok(table, 'table must be non null');
    assert.ok(column, 'column must be non null');
    assert.ok(/\w*_id/, 'column must be an id'); // id columns are unique, ensuring only one row gets deleted
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
                assert.ok(results === undefined || results.rows.length <= 1, 'no more than one row should be found for ' + column.name + ' == ' + value);

                if (err) {
                    cb(handlePostgresError(err));
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

var handlePostgresError = function(err) {
    switch(err.code) {
    case '23505':
        err.name = 'ConflictError';
        err.httpStatusCode = 409;
        break;
    case '42501':
        err.name = 'ForbiddenError';
        err.httpStatusCode = 403;
        break;
    default:
        err.name = 'BadRequestError';
        err.httpStatusCode = 400;
        break;
    }
    return err;
};

//    Public
module.exports = {
    app: app,
    build: build,
    account: account,
    getClient: getClient,
    create: create,
    updateOne: updateOne,
    retrieveAll: retrieveAll,
    retrieveOne: retrieveOne,
    destroyOne: destroyOne
};
