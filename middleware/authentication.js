//    Dependencies
var auth = require('../app/models/authentication');

//===============
//    Middleware
//===============

module.exports = function() {
    return function(req, res, next) {
        var email = req.get('x-authentication-email');
        var token = req.get('x-authentication-token');
        if (!email || !token) {
            var err = new Error();
            err.name = 'ForbiddenError';
            err.message = 'missing email or token header';
            res.send(403, JSON.stringify(err));
        } else {
            auth.authenticateAccount(email, token, function(err, requestedAccount) {
                if (err || !requestedAccount) {
                    res.send(err.httpStatusCode || 500, JSON.stringify(err, ['name', 'message', 'detail']));
                } else {
                    req.account = requestedAccount;
                    next();
                }
            });
        }
    };
};
