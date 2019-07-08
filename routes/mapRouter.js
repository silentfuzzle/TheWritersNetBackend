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
    .get(authenticate.verifyUser, 
        mapController.checkMap, 
        mapController.getMap)
    // Expects addlink, pageid
    .post(authenticate.verifyUser, 
        mapController.checkMap,
        mapController.putLink)
    // Expects backward (boolean)
    .put(authenticate.verifyUser, 
        mapController.checkMap,
        mapController.putPosition)
    .delete(authenticate.verifyUser, 
        mapController.checkMap,
        mapController.deleteMap);

module.exports = mapRouter;