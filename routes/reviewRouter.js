const express = require('express');
const bodyParser = require('body-parser');

const reviewRouter = express.Router();
reviewRouter.use(bodyParser.json());

reviewRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending id, userid, User.displayname, rating, title, review, progress, timestamp for all reviews for book ${req.body.bookid}`);
    })
    .post((req,res,next) => {
        res.end(`Adding review (${req.body.userid}, ${req.body.bookid}, ${req.body.rating}, ${req.body.title}, ${req.body.review})`);
    });

reviewRouter.route('/authored')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending id, bookid, Book.title, rating, title, review, progress, timestamp for all reviews for user ${req.body.userid}`);
    });

reviewRouter.route('/:reviewId')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending review ${req.params.reviewId}`);
    })
    .put((req,res,next) => {
        res.end(`Updating review ${req.params.reviewId} with details (${req.body.rating}, ${req.body.title}, ${req.body.review})`);
    })
    .delete((req,res,next) => {
        res.end(`Deleting review ${req.params.reviewId}`);
    });

module.exports = reviewRouter;