//    Dependencies
var bcrypt = require('bcrypt');
var sql = require('sql');
var db = require('../../config/db');
var account = require('./account');

var authenticateAccount = function(email, password, cb) {
    //    Get the account to authenticate
    var returningColumns = ['password_hash', 'token', 'token_expires_at'];
    db.retrieveOne(db.account, db.account.email, email, returningColumns, function(err, requestedAccount) {
        if (err) {
            cb(unauthorizedError());    //    Account not found
        } else {
            //    Verify the password
            bcrypt.compare(password, requestedAccount.password_hash, function(err, match) {
                delete requestedAccount.password_hash;
                if (err || !match) {
                    cb(err || unauthorizedError());    //    Bcrypt error or invalid password
                } else {
                    var expirationDate = new Date(requestedAccount.token_expires_at);
                    var now = new Date();
                    if (expirationDate < now) {
                        //    Expired token; get a fresh one
                        account.updateToken(email, function(err, requestedAccount) {
                            if (err) {
                                cb(err);
                            } else {
                                cb(null, requestedAccount);
                            }
                        });
                    } else {
                        cb(null, requestedAccount);    //    Return the token
                    }
                }
            });
        }
    });
};

//    Helper function to quickly create an UnauthorizedError
var unauthorizedError = function() {
    var err = new Error();
    err.name = 'UnauthorizedError';
    err.message = 'invalid email or password';
    err.httpStatusCode = 401;
    return err;
};

module.exports = {
    authenticateAccount: authenticateAccount
};
