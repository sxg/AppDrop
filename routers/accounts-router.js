//    Dependencies
var express = require('express');
var account = require('../models/account');

//    Constants
var API_V1 = '/api/v1';

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

//    /api/v1/accounts
accountsRouter.route(API_V1 + '/accounts')
.get(function(req, res) {
    account.getAllAccounts(function(err, accounts) {
        respond(err, accounts, res);
    });
})
.post(function(req, res) {
    account.createAccount(req.body, function(err, account) {
        respond(err, account, res);
    });
});

//    /api/v1/accounts/:account_id
accountsRouter.route(API_V1 + '/accounts/:account_id')
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
