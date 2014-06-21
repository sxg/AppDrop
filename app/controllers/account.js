//    Dependencies
var express = require('express');
var account = require('../models/account');
var permission = require('../../middleware/permission');

//    Setup
var accountsRouter = express.Router();


//===========
//    Routes
//===========

//    accounts may be an Object or an Array
var respond = function(err, accounts, res) {
    if (err) {
        res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
    } else {
        res.json(accounts);
    }
};

//    /accounts
accountsRouter.route('/accounts')
.get(permission.requireMinLevel(permission.levels.USER), function(req, res) {
    account.getAllAccounts(function(err, accounts) {
        respond(err, accounts, res);
    });
})
.post(permission.requireMinLevel(permission.levels.ADMIN), function(req, res) {
    account.createAccount(req.body, function(err, account) {
        respond(err, account, res);
    });
});

//    /accounts/:account_id
accountsRouter.route('/accounts/:account_id')
.get(function(req ,res) {
    account.getAccount(req.params.account_id, function(err, account) {
        respond(err, account, res);
    });
})
.put(function(req, res) {
    account.updateAccount(req.params.account_id, req.body, function(err, account) {
        respond(err, account, res);
    });
})
.delete(function(req, res) {
    account.deleteAccount(req.params.account_id, function(err, account) {
        respond(err, account, res);
    });
});

//    Public
module.exports = accountsRouter;
