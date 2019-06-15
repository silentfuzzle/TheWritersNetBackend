const express = require('express');
const bodyParser = require('body-parser');

const bookRouter = express.Router();
bookRouter.use(bodyParser.json());

bookRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end('Sending id, title, subtitle, ownerid, User.displayname, length, rating for all books');
    })
    .post((req,res,next) => {
        res.end(`Adding book (${req.body.title}, ${req.body.subtitle}, ${req.body.description})`);
    });

bookRouter.route('/authored')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending id, startpageid, title, Permission.permissionid, Permission.permissiontype for all books by user ${req.body.userid}`);
    });

bookRouter.route('/opened')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending id, Review.reviewid, title, progress, rating, Map.currpage for all books opened by user ${req.body.userid}`);
    });

bookRouter.route('/:bookId')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending book ${req.params.bookId}`);
    })
    .put((req,res,next) => {
        res.end(`Updating book ${req.params.bookId} with details (${req.body.startpageid}, ${req.body.title}, ${req.body.subtitle}, ${req.body.description})`);
    })
    .delete((req,res,next) => {
        res.end(`Deleting book ${req.params.bookId}`);
    });

module.exports = bookRouter;