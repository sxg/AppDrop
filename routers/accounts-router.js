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

//    /api/v1/accounts
accountsRouter.route(API_V1 + '/accounts')
.get(function(req, res) {
    account.getAllAccounts(function(err, accounts) {
        if (err) {
            res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            res.json(accounts);
        }
    });
})
.post(function(req, res) {
    account.createAccount(req.body, function(err, account) {
        if (err) {
            res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            res.json(account);
        }
    });
});

//    /api/v1/accounts/:account_id
accountsRouter.route(API_V1 + '/accounts/:account_id')
.get(function(req ,res) {
    account.getAccount(req.params.account_id, function(err, account) {
        if (err) {
            res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            res.json(account);
        }
    });
})
.put(function(req, res) {
    account.updateAccount(req.params.account_id, req.body, function(err, account) {
        if (err) {
            res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            res.json(account);
        }
    });
})
.delete(function(req, res) {
    account.deleteAccount(req.params.account_id, function(err) {
        if (err) {
            res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            res.send(204);
        }
    });
});

//    Public
module.exports = accountsRouter;
