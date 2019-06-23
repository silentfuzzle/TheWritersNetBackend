const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authenticate = require('../authenticate');
const userController = require('../controllers/mysql/userController');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

// Returns user id, displayname, permissionid, permission
userRouter.get('/coauthors/:bookId', userController.getCoAuthors);

userRouter.post('/signup', userController.signup);
    
userRouter.post('/login', passport.authenticate('local'), (req, res) => {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: true,
        token: token,
        status: 'You are successfully logged in!'
    });
});

userRouter.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});

userRouter.route('/:userId')
    // Returns all fields
    .get(userController.getUser)
    // Expects all fields except email
    .put(authenticate.verifyUser, userController.putUser)
    // Expects oldpassword, newpassword, email
    .post(authenticate.verifyUser, userController.putSettings);

module.exports = userRouter;