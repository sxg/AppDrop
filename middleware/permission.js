//    The order of this array matters - the indexes are used to rank permission levels
var permissions = ['user', 'admin'];

var invalidPermissionError = function() {
    var err = new Error();
    err.name = 'ForbiddenError';
    err.message = 'you do not have the required permission level to perform this request';
    return err;
};

var invalidOwnershipError = function() {
    var err = new Error();
    err.name = 'ForbiddenError';
    err.message = 'you do not own the account associated with this request';
    return err;
};


//===============
//    Middleware
//===============

var needMinLevel = function(requiredPermissionLevel) {
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

var needToOwnAccount = function() {
    return function(req, res, next) {
        var accountID = req.account.account_id;
        var requestedAccountID = parseInt(req.params.account_id);
        if (accountID !== requestedAccountID) {
            res.send(403, JSON.stringify(invalidOwnershipError(), ['name', 'message']));
        } else {
            next();
        }
    };
};

module.exports = {
    needMinLevel: needMinLevel,
    needToOwnAccount: needToOwnAccount,
    levels: {
        USER: 'user',
        ADMIN: 'admin'
    }
};
