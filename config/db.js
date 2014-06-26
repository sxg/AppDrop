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
    columns: ['app_id', 'bundle_id', 'name', 'uuid', 'private', 'password_hash', 'account_id', 'created_at']
});

var build = sql.define({
    name: 'build',
    columns: ['build_id', 'build_number', 'version', 'path', 'created_at', 'downloaded_last_at', 'download_count', 'bundle_id', 'account_id']
});

var account = sql.define({
    name: 'account',
    columns: ['account_id', 'name', 'email', 'password_hash', 'created_at', 'permission', 'token_expires_at', 'token']
});


//=========
//    CRUD
//=========

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
            //    Try/catch catches errors thrown in forming the SQL query due to bad input
            try {
                var q = table.insert(object).returning(returningColumns).toQuery();
                client.query(q.text, q.values, function(err, results) {
                    done();

                    if (err) {
                        cb(handlePostgresError(err));
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

var getAll = function(table, returningColumns, cb) {
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

var getOne = function(table, columns, values, returningColumns, cb) {
    //    Check parameters
    assert.ok(table, 'table must be non null');
    assert.ok(columns instanceof Array, 'columns must be an array');
    assert.ok(values instanceof Array, 'values must be an array');
    assert.ok(returningColumns instanceof Array, 'returningColumns must be an array');
    assert.ok(cb instanceof Function, 'cb must be a Function');

    getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Get the object in the database
            var q = appendWhere(table.select(returningColumns).from(table), columns, values);
            client.query(q.text, q.values, function(err, results) {
                done();
                assert.ok(results === undefined || results.rows.length <= 1, 'no more than one row should be found for ' + columns + ' == ' + values);

                if (err) {
                    cb(handlePostgresError(err));
                } else if (results.rows.length === 0) {
                    err = new Error('NotFoundError');
                    err.message = 'no data exists where ' + columns + ' == ' + values;
                    err.httpStatusCode = 404;
                    cb(err);
                } else {
                    cb(null, results.rows[0]);
                }
            });
        }
    });
};

var update = function(table, columns, values, object, returningColumns, cb) {
    //    Check parameters
    assert.ok(table, 'table must be non null');
    assert.ok(columns instanceof Array, 'columns must be an array');
    assert.ok(values instanceof Array, 'values must be an array');
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
                var q = appendWhere(table.update(object).returning(returningColumns), columns, values);
                client.query(q.text, q.values, function(err, results) {
                    done();
                    assert.ok(results === undefined || results.rows.length <= 1, 'no more than one row should be found for ' + columns + ' == ' + values);

                    if (err) {
                        cb(handlePostgresError(err));
                    } else if (results.rows.length === 0) {
                        err = new Error('NotFoundError');
                        err.message = 'no data exists where ' + columns + ' == ' + values;
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

var destroy = function(table, columns, values, returningColumns, cb) {
    //    Check paramters
    assert.ok(table, 'table must be non null');
    assert.ok(columns instanceof Array, 'columns must be an array');
    assert.ok(values instanceof Array, 'values must be an array');
    assert.ok(cb instanceof Function, 'cb must be a Function');

    getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            //    Destroy the matching objects in the database
            var q = appendWhere(table.delete().from(table).returning(returningColumns), columns, values);
            client.query(q.text, q.values, function(err, results) {
                done();
                assert.ok(results === undefined || results.rows.length <= 1, 'no more than one row should be found for ' + columns + ' == ' + values);

                if (err) {
                    cb(handlePostgresError(err));
                } else if (results.rows.length === 0) {
                    err = new Error('NotFoundError');
                    err.message = 'no data exists where ' + columns + ' == ' + values;
                    err.httpStatusCode = 404;
                    cb(err);
                } else {
                    cb(null, results.rows[0]);
                }
            });
        }
    });
};

//============
//    Helpers
//============

var appendWhere = function(q, columns, values) {
    assert.equal(columns.length, values.length, 'number of columns must equal number of values');

    for (var i = 0; i < columns.length; i++) {
        q.where(columns[i].equals(values[i]));
    }
    return q.toQuery();
};

var randomMD5Hash = function() {
    var random = sql.functionCallCreator('random');
    var md5 = sql.functionCallCreator('md5');
    return md5(random().cast('text'));
};

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
    create: create,
    update: update,
    getAll: getAll,
    getOne: getOne,
    destroy: destroy,
    randomMD5Hash: randomMD5Hash
};
