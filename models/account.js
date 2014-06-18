//    Dependencies
var bcrypt = require('bcrypt');
var db = require('../db/db');

//    Constants
var LIMIT = 1000;

//    account:
//        required: name, email, password
//    cb(err, account)
var createAccount = function(account, cb) {
    //    Check for required values
    if (!account.name) {
        cb('Error: account requires a name');
    } else if (!account.email) {
        cb('Error: account requires an email');
    } else if (!account.password) {
        cb('Error: account requires a password');
    } else {
        //    Hash the password
        bcrypt.hash(account.password, 10, function(err, hash) {
            if (err) {
                console.log('Error: couldn\'t hash password');
                throw err;
            }
            account.password_hash = hash;
            delete account.password;

            db.getClient(function(err, client, done) {
                if (err) {
                    cb(err);
                } else {
                    //    Create the new account
                    var q = db.account.insert(account)
                                      .returning('account_id', 'name', 'email')
                                      .toQuery();
                    client.query(q.text, q.values, function(err, results) {
                        done();
                        if (err) {
                            cb('Error creating account: ' + err);
                        } else {
                            cb(null, results.rows[0]);
                        }
                    });
                }
            });
        });
    }
};

//    cb(err, accounts)
var getAllAccounts = function(cb) {
    //    Get all accounts
    db.getClient(function(err, client, done) {
        if (err) {
            cb(err);
        } else {
            var q = db.account.select('account_id', 'name', 'email')
                              .from(db.account)
                              .limit(LIMIT)
                              .toQuery();
            client.query(q.text, q.values, function(err, results) {
                done();
                if (err) {
                    cb('Error getting accounts: ' + err);
                } else {
                    cb(null, results.rows);
                }
            });
        }
    });
};

//    cb(err, account)
var getAccount = function(account_id, cb) {
    //    Make sure there is an account ID
    if (!account_id) {
        cb('Error: account ID is required');
    } else {
        db.getClient(function(err, client, done) {
            if (err) {
                cb(err);
            } else {
                //    Get the account by ID
                var q = db.account.select('account_id', 'name', 'email')
                                  .from(db.account)
                                  .where(db.account.account_id.equals(account_id))
                                  .toQuery();
                client.query(q.text, q.values, function(err, results) {
                    done();
                    if (err) {
                        cb('Error getting account:' + err);
                    } else if (results.rows.length === 0) {
                        cb('Error getting account: no account with account ID ' + account_id + ' exists');
                    } else {
                        cb(null, results.rows[0]);
                    }
                });
            }
        });
    }
};

//    cb(err, account)
var updateAccount = function(account_id, account, cb) {
    //    Make sure there is an account ID
    if (!account_id) {
        cb('Error: account ID is required');
    } else {
        db.getClient(function(err, client, done) {
            if (err) {
                cb(err);
            } else {
                //    Update the account by ID
                var q = db.account.update(account)
                                  .where(db.account.account_id.equals(account_id))
                                  .returning('account_id', 'name', 'email')
                                  .toQuery();
                client.query(q.text, q.values, function(err, results) {
                    done();
                    if (err) {
                        cb('Error updating account:' + err);
                    } else {
                        cb(null, results.rows[0]);
                    }
                });
            }
        });
    }
};

//    cb(err)
var deleteAccount = function(account_id, cb) {
    //    Make sure there is an account ID
    if (!account_id) {
        cb('Error: account ID is required');
    } else {
        //    Delete the account by ID
        db.getClient(function(err, client, done) {
            if (err) {
                cb(err);
            } else {
                var q = db.account.delete()
                                  .from(db.account)
                                  .where(db.account.account_id.equals(account_id))
                                  .toQuery();
                client.query(q.text, q.values, function(err) {
                    done();
                    if (err) {
                        cb('Error deleting account: ' + err);
                    } else {
                        cb(null);
                    }
                });
            }
        });
    }
};

//    Public
module.exports = {
    createAccount: createAccount,
    getAllAccounts: getAllAccounts,
    getAccount: getAccount,
    updateAccount: updateAccount,
    deleteAccount: deleteAccount
};
