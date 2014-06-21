//    The order of this array matters - the indexes are used to rank permission levels
var permissions = ['user', 'admin'];

var invalidPermissionError = function() {
    var err = new Error();
    err.name = 'ForbiddenError';
    err.message = 'you do not have the required permission level to perform this request';
    return err;
};


//===============
//    Middleware
//===============

var minLevel = function(requiredPermissionLevel) {
    return function(req, res, next) {
        var requiredRank = permissions.indexOf(requiredPermissionLevel);
        var accountRank = permissions.indexOf(req.account.permission);
        if (accountRank >= requiredRank) {
            next();
        } else {
            res.send(403, JSON.stringify(invalidPermissionError(), ['name', 'message', 'detail']));
        }
    };
};

var check = function(block) {
    return function(req, res, next) {
        var err = block();
        if (err) {
            res.send(err.httpStatusCode || 403, JSON.stringify(err, ['name', 'message', 'detail']));
        } else {
            next();
        }
    };
};

module.exports = {
    minLevel: minLevel,
    check: check,
    levels: {
        USER: 'user',
        ADMIN: 'admin'
    }
};
