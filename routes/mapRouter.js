const express = require('express');
const bodyParser = require('body-parser');

const mapRouter = express.Router();
mapRouter.use(bodyParser.json());

mapRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .post((req,res,next) => {
        res.end(`Adding map (${req.body.userid}, ${req.body.bookid}, ${req.body.maplinks}, ${req.body.currpage})`);
    });

mapRouter.route('/:mapId')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        res.end(`Sending map ${req.params.mapId}`);
    })
    .post((req,res,next) => {
        res.end(`Adding link to map ${req.params.mapId} with details (${req.body.maplinks}, ${req.body.currpage})`);
    })
    .put((req,res,next) => {
        res.end(`Updating position in map ${req.params.mapId} when moving to the ${req.body.next ? 'next' : 'previous'} page in history`);
    })
    .delete((req,res,next) => {
        res.end(`Deleting map ${req.params.mapId}`);
    });

module.exports = mapRouter;