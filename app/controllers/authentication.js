//    Dependencies
var express = require('express');
var auth = require('../models/authentication');

//    Setup
var authRouter = express.Router();


//===========
//    Routes
//===========

//    /login
authRouter
.route('/login')
.post(function(req, res) {
    auth.getToken(req.body.email, req.body.password, function(err, token) {
        if (err) {
            res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            res.json(token);
        }
    });
});

//    Public
module.exports = authRouter;
