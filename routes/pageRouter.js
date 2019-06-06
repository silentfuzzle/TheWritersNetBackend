const express = require('express');
const bodyParser = require('body-parser');

const pageRouter = express.Router();
pageRouter.use(bodyParser.json());

pageRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending all pages in book ${req.body.bookId}`);
    })
    .post((req,res,next) => {
        res.end(`Adding page ${req.body.title}`);
    });

pageRouter.route('/:pageId')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending page ${req.params.pageId}`);
    })
    .put((req,res,next) => {
        res.end(`Updating page ${req.params.pageId} to ${req.body.titl}`);
    })
    .delete((req,res,next) => {
        res.end(`Deleting page ${req.params.pageId}`);
    });

module.exports = pageRouter;