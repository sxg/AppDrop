//    Dependencies
var account = require('../models/account');


//===============
//    Operations
//===============

//    accounts may be an Object or an Array
var respond = function(err, accounts, res) {
    if (err) {
        res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
    } else {
        res.json(accounts);
    }
};


var create = function(req, res) {
    account.createAccount(req.body, function(err, account) {
        respond(err, account, res);
    });
};

var getAll = function(req, res) {
    account.getAllAccounts(function(err, accounts) {
        respond(err, accounts, res);
    });
};

var getOne = function(req ,res) {
    account.getAccount(req.account.account_id, req.params.accountID, function(err, account) {
        respond(err, account, res);
    });
};

var update = function(req, res) {
    account.updateAccount(req.account.account_id, req.params.accountID, req.body, function(err, account) {
        respond(err, account, res);
    });
};

var destroy = function(req, res) {
    account.deleteAccount(req.account.account_id, req.params.accountID, function(err, account) {
        respond(err, account, res);
    });
};

//    Public
module.exports = {
    create: create,
    getAll: getAll,
    getOne: getOne,
    update: update,
    destroy: destroy
};
