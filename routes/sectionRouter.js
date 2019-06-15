const express = require('express');
const bodyParser = require('body-parser');

const sectionRouter = express.Router();
sectionRouter.use(bodyParser.json());

sectionRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending all sections for book ${req.body.bookid}`);
    })
    .post((req,res,next) => {
        res.end(`Adding section (${req.body.bookid}, ${req.body.title}, ${req.body.displaytitle}, ${req.body.content})`);
    });

sectionRouter.route('/positions')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending id, title, Truncated.content, Calculated.inUse for all sections for page ${req.body.pageid}`);
    })
    .put((req,res,next) => {
        res.end(`Updating section positions ${JSON.stringify(req.body.positions)}`);
    })
    .post((req,res,next) => {
        res.end(`Adding section position (${req.body.pageid}, ${req.body.sectionid}, ${req.body.position})`);
    })
    .delete((req,res,next) => {
        res.end(`Deleting section position ${req.body.positionid}`);
    });

sectionRouter.route('/:sectionId')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending section ${req.params.sectionId}`);
    })
    .put((req,res,next) => {
        res.end(`Updating section ${req.params.sectionId} with details (${req.body.title}, ${req.body.displaytitle}, ${req.body.content})`);
    })
    .delete((req,res,next) => {
        res.end(`Deleting section ${req.params.sectionId}`);
    });

module.exports = sectionRouter;