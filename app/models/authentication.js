//    Dependencies
var bcrypt = require('bcrypt');
var db = require('../../config/db');

var authenticateAccount = function(email, password, cb) {
    var returningColumns = ['password_hash', 'token', 'token_expires_at'];
    db.retrieveOne(db.account, db.account.email, email, returningColumns, function(err, account) {
        var formatError = function(err) {
            err.name = 'UnauthorizedError';
            err.message = 'invalid email or password';
            err.httpStatusCode = 401;
        };

        if (err || !account) {
            formatError(err);
            cb(err);
        } else {
            bcrypt.compare(password, account.password_hash, function(err, res) {
                if (err) {
                    cb(err);
                } else {
                    if (res) {
                        cb(null, account.token, account.token_expires_at);
                    } else {
                        err = new Error();
                        formatError(err);
                        cb(err);
                    }
                }
            });
        }
    });
};

module.exports = {
    authenticateAccount: authenticateAccount
};
