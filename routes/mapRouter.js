const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const mapController = require('../controllers/mysql/mapController').mapController;

const mapRouter = express.Router();
mapRouter.use(bodyParser.json());

// Expects bookid, pageid
mapRouter.post('/', authenticate.verifyUser, 
    mapController.checkMap,
    mapController.postMap);

mapRouter.route('/:mapId')
    // Returns all fields
    .get((req,res,next) => {
        res.end(`Sending map ${req.params.mapId}`);
    })
    // Expects maplinks, pageid
    .post(authenticate.verifyUser, mapController.putLink)
    // Expects backward (boolean)
    .put(authenticate.verifyUser, mapController.putPosition)
    .delete(authenticate.verifyUser, 
        mapController.checkMap,
        mapController.deleteMap);

module.exports = mapRouter;