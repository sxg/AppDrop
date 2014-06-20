//    Dependencies
var express = require('express');
var auth = require('../models/authentication');

//    Constants
var API_V1 = '/api/v1';

//    Setup
var authRouter = express.Router();


//===========
//    Routes
//===========

//    /api/v1/login
authRouter.route(API_V1 + '/login')
.post(function(req, res) {
    auth.authenticateAccount(req.body.email, req.body.password, function(err, token, tokenExpiration) {
        if (err) {
            res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            res.json({
                token: token,
                token_expires_at: tokenExpiration
            });
        }
    });
});

//    Public
module.exports = authRouter;
