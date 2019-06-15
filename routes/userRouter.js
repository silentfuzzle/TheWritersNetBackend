const express = require('express');
const bodyParser = require('body-parser');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending User.userid, User.displayname for all authors for book ${req.body.bookid}`);
    })
    .post((req,res,next) => {
        res.end(`Adding user (${req.body.username}, ${req.body.email}, ${req.body.password})`);
    });

userRouter.route('/:userId')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending user ${req.params.userId}`);
    })
    .put((req,res,next) => {
        res.end(`Updating user ${req.params.userId} with details (${req.body.displayname}, ${req.body.facebook}, ${req.body.linkedin}, ${req.body.twitter}, ${req.body.youtube}, ${req.body.website}, ${req.body.about})`);
    })
    .post((req,res,next) => {
        res.end(`Updating settings for user ${req.params.userId} with details (${req.body.email}, ${req.body.oldpassword}, ${req.body.newpassword})`);
    })
    .delete((req,res,next) => {
        res.end(`Deleting user ${req.params.userId}`);
    });

module.exports = userRouter;