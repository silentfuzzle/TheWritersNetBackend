const express = require('express');
const bodyParser = require('body-parser');

const permissionRouter = express.Router();
permissionRouter.use(bodyParser.json());

permissionRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending id, userid, permissionid, Permission.permissiontype, User.username for all permissions for book ${req.body.bookid}`);
    })
    .post((req,res,next) => {
        res.end(`Adding permission (${req.body.bookid}, ${req.body.userid}, ${req.body.permissionid})`);
    });

permissionRouter.get('/types', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Sending all permission types`);
});

permissionRouter.route('/:permissionId')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .put((req,res,next) => {
        res.end(`Updating permission ${req.params.permissionId} to permission ${req.body.permissionid}`);
    })
    .delete((req,res,next) => {
        res.end(`Deleting permission ${req.params.permissionId}`);
    });

module.exports = permissionRouter;