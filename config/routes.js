//    Dependencies
var express = require('express');
var appController = require('../app/controllers/app');
var accountController = require('../app/controllers/account');
var buildController = require('../app/controllers/build');
var authController = require('../app/controllers/authentication');
var perm = require('../middleware/permission');
var auth = require('../middleware/authentication');

//    Constants
var API_V1 = '/api/v1';

//    Setup
var router = express.Router();
router.use(API_V1, auth());


//===========
//    Routes
//===========

//    LOG IN
router
.post('/login', authController.login);

//    ACCOUNTS
router
.get(API_V1 + '/accounts', perm.needLevel(perm.levels.ADMIN), accountController.getAll)
.post(API_V1 + '/accounts', accountController.create)
.get(API_V1 + '/accounts/:accountID', accountController.getOne)
.put(API_V1 + '/accounts/:accountID', accountController.update)
.delete(API_V1 + '/accounts/:accountID', accountController.destroy);

//    APPS
router
.get(API_V1 + '/apps', perm.needLevel(perm.levels.ADMIN), appController.getAll)
.post(API_V1 + '/apps', appController.create)
.get(API_V1 + '/apps/:appID', appController.getOne)
.put(API_V1 + '/apps/:appID', appController.update)
.delete(API_V1 + '/apps/:appID', appController.destroy);

//    BUILDS
router
.get(API_V1 + '/builds', perm.needLevel(perm.levels.ADMIN), buildController.getAll)
.post(API_V1 + '/builds', buildController.create)
.get(API_V1 + '/builds/:buildID', buildController.getOne)
.put(API_V1 + '/builds/:buildID', buildController.update)
.delete(API_V1 + '/builds/:buildID', buildController.destroy);

module.exports = router;
