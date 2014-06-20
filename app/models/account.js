//    Dependencies
var bcrypt = require('bcrypt');
var db = require('../../config/db');

//    Constants
var PUBLIC_FIELDS = ['account_id', 'name', 'email', 'created_at'];
var LIMIT = 1000;
var HASH_ROUNDS = 10;

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
            if (err) {
                cb(err);
            } else {
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

//    Public
module.exports = {
    createAccount: createAccount,
    getAllAccounts: getAllAccounts,
    getAccount: getAccount,
    updateAccount: updateAccount,
    deleteAccount: deleteAccount
};
