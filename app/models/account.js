//    Dependencies
var bcrypt = require('bcrypt');
var sql = require('sql');
var db = require('../../config/db');

//    Constants
var PUBLIC_FIELDS = ['account_id', 'name', 'email', 'permission', 'created_at'];
var LIMIT = 1000;
var HASH_ROUNDS = 10;


//=========
//    CRUD
//=========

//    account:
//        required: name, email, password
//    cb(err, account)
var createAccount = function(account, cb) {
    //    Hash the password
    bcrypt.hash(account.password, HASH_ROUNDS, function(err, hash) {
        if (err) {
            cb(err);
        } else {
            account.password_hash = hash;
            delete account.password;

            db.create(db.account, account, PUBLIC_FIELDS, cb);
        }
    });
};

//    cb(err, accounts)
var getAllAccounts = function(cb) {
    db.retrieveAll(db.account, PUBLIC_FIELDS, cb);
};

//    cb(err, account)
var getAccount = function(account_id, cb) {
    db.retrieveOne(db.account, db.account.account_id, account_id, PUBLIC_FIELDS, cb);
};

//    cb(err, account)
var updateAccount = function(account_id, account, cb) {
    var update = function() {
        db.updateOne(db.account, db.account.account_id, account_id, account, PUBLIC_FIELDS, cb);
    };

    if (account.password) {

        //    Hash the password
        bcrypt.hash(account.password, HASH_ROUNDS, function(err, hash) {
            if (err) cb(err);
            else {
                account.password_hash = hash;
                delete account.password;
                update();
            }
        });
    } else {
        update();
    }
};

//    cb(err)
var deleteAccount = function(account_id, cb) {
    db.destroyOne(db.account, db.account.account_id, account_id, PUBLIC_FIELDS, cb);
};

//===================
//    Authentication
//===================

var updateToken = function(email, cb) {
    var random = sql.functionCallCreator('random');
    var md5 = sql.functionCallCreator('md5');
    var nextWeek = new Date((new Date()).getTime() + 604800000);

    var updatedToken = {
        token_expires_at: nextWeek.toISOString(),
        token: md5(random().cast('text'))
    };
    var returningColumns = ['token', 'token_expires_at'];
    db.updateOne(db.account, db.account.email, email, updatedToken, returningColumns, function(err, account) {
        if (err) {
            cb(err);
        } else {
            cb(null, account);
        }
    });
};

//    Public
module.exports = {
    createAccount: createAccount,
    getAllAccounts: getAllAccounts,
    getAccount: getAccount,
    updateAccount: updateAccount,
    deleteAccount: deleteAccount,
    updateToken: updateToken
};
