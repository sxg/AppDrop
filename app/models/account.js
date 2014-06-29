//    Dependencies
var bcrypt = require('bcrypt');
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
    db.getAll(db.account, PUBLIC_FIELDS, cb);
};

//    cb(err, account)
var getAccount = function(requestingAccount, accountID, cb) {
    var cols = [db.account.account_id];
    var vals = [accountID];
    if (requestingAccount.permission === 'user') {
        cols.push(db.account.account_id);
        vals.push(requestingAccount.account_id);
    }
    db.getOne(db.account, cols, vals, PUBLIC_FIELDS, cb);
};

//    cb(err, account)
var updateAccount = function(requestingAccount, accountID, account, cb) {
    var update = function() {
        var cols = [db.account.account_id];
        var vals = [accountID];
        if (requestingAccount.permission === 'user') {
            cols.push(db.account.account_id);
            vals.push(requestingAccount.account_id);
        }
        db.update(db.account, cols, vals, account, PUBLIC_FIELDS, cb);
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
var destroyAccount = function(requestingAccount, accountID, cb) {
    var cols = [db.account.account_id];
    var vals = [accountID];
    if (requestingAccount.permission === 'user') {
        cols.push(db.account.account_id);
        vals.push(requestingAccount.account_id);
    }
    db.destroy(db.account, cols, vals, PUBLIC_FIELDS, cb);
};

//===================
//    Authentication
//===================

var updateToken = function(email, cb) {
    var nextWeek = new Date((new Date()).getTime() + 604800000);

    var updatedToken = {
        token_expires_at: nextWeek.toISOString(),
        token: db.randomMD5Hash()
    };
    var returningColumns = ['token', 'token_expires_at'];
    db.update(db.account, [db.account.email], [email], updatedToken, returningColumns, function(err, account) {
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
    destroyAccount: destroyAccount,
    updateToken: updateToken
};
