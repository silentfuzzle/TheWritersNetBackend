const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const permissionController = require('../controllers/mysql/permissionController').permissionController;

const permissionRouter = express.Router();
permissionRouter.use(bodyParser.json());

// Expects bookid, userid, permissionid
permissionRouter.post('/', 
    authenticate.verifyUser,
    permissionController.checkIsModerator,
    permissionController.postPermission);

// Returns id, username, displayname, permissionid
permissionRouter.get('/book/:bookId', 
    authenticate.verifyUser,
    permissionController.checkIsModerator,
    permissionController.getPermissions);

// Returns id, name
permissionRouter.get('/types', 
    authenticate.verifyUser,
    permissionController.getPermissionTypes);

permissionRouter.route('/:pId')
    // Expects permissionid
    .put(authenticate.verifyUser,
        permissionController.checkIsModerator,
        permissionController.getPermissions)
    .delete(authenticate.verifyUser,
        permissionController.checkIsModerator,
        permissionController.getPermissions);

module.exports = permissionRouter;