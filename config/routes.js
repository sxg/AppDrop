//    Dependencies
var express = require('express');
var appController = require('../app/controllers/app');
var accountController = require('../app/controllers/account');
var buildController = require('../app/controllers/build');
var authController = require('../app/controllers/authentication');
var perm = require('../middleware/permission');

//    Constants
var API_V1 = '/api/v1';

//    Setup
var router = express.Router();


//===========
//    Routes
//===========

//    Log In
router
.post('/login', authController.login);

//    ACCOUNTS
router.route(API_V1)
.get('/accounts', perm.needMinLevel(perm.levels.ADMIN), accountController.getAll)
.post('/accounts', accountController.create)
.get('/accounts/:accountID', perm.needToOwnAccount(), accountController.getOne)
.put('/accounts/:accountID', perm.needToOwnAccount(), accountController.update)
.delete('/accounts/:accountID', perm.needToOwnAccount(), accountController.destroy);

//    APPS
router.route(API_V1)
.get('/apps', perm.needMinLevel(perm.levels.ADMIN), appController.getAll)
.post('/apps', appController.create)
.get('/apps/:appID', appController.getOne)
.put('/apps/:appID', appController.update)
.delete('/apps/:appID', appController.destroy);

//    BUILDS
router.route(API_V1)
.get('/builds', perm.needMinLevel(perm.levels.ADMIN), buildController.getAll)
.post('/builds', buildController.create)
.get('/builds/:buildID', buildController.getOne)
.put('/builds/:buildID', buildController.update)
.delete('/builds/:buildID', buildController.destroy);
