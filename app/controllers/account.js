//    Dependencies
var express = require('express');
var account = require('../models/account');
var perm = require('../../middleware/permission');

//    Constants
var GENERAL_ROUTE = '/accounts';
var SPECIFIC_ROUTE = '/accounts/:account_id';

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
accountsRouter
.route(GENERAL_ROUTE)
.get(perm.needMinLevel(perm.levels.ADMIN), function(req, res) {
    account.getAllAccounts(function(err, accounts) {
        respond(err, accounts, res);
    });
})
.post(function(req, res) {
    account.createAccount(req.body, function(err, account) {
        respond(err, account, res);
    });
});

//    /accounts/:account_id
accountsRouter
.use(SPECIFIC_ROUTE, perm.needToOwnAccount())
.route(SPECIFIC_ROUTE)
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
