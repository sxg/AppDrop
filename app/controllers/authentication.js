//    Dependencies
var auth = require('../models/authentication');


//===============
//    Operations
//===============

var login = function(req, res) {
    auth.getToken(req.body.email, req.body.password, function(err, token) {
        if (err) {
            res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            res.json(token);
        }
    });
};

//    Public
module.exports = {
    login: login
};
