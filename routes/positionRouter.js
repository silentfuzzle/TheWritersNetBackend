const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const positionController = require('../controllers/mysql/positionController').positionController;
const pageController = require('../controllers/mysql/pageController').pageController;

const positionRouter = express.Router();
positionRouter.use(bodyParser.json());

positionRouter.route('/page/:pageId')
    // Returns id, position, title, displaytitle, content
    .get(positionController.getPositions)
    // Expects sectionid, position
    .post(authenticate.verifyUser,
        pageController.checkPage,
        positionController.postPosition);

positionRouter.route('/:positionId')
    // Expects position
    .put(authenticate.verifyUser,
        positionController.checkBook,
        positionController.putPosition)
    .delete(authenticate.verifyUser,
        positionController.checkBook,
        positionController.deletePosition);

exports = positionRouter;