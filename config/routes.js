//    Dependencies
var express = require('express');
var appsController = require('../app/controllers/app');
var accountsController = require('../app/controllers/account');
var buildsController = require('../app/controllers/build');
var authController = require('../app/controllers/authentication');
var perm = require('../middleware/permission');

//    Constants
var API_V1 = '/api/v1';

//    Setup
var router = express.Router();


//===========
//    Routes
//===========

//    ACCOUNTS
router.route(API_V1)
.get('/accounts', perm.needMinLevel(perm.levels.ADMIN), accountsController.getAll)
.post('/accounts', accountsController.create)
.get('/accounts/:accountID', perm.needToOwnAccount(), accountsController.getOne)
.put('/accounts/:accountID', perm.needToOwnAccount(), accountsController.update)
.delete('/accounts/:accountID', perm.needToOwnAccount(), accountsController.destroy);
