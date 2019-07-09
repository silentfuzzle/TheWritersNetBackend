const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const pageController = require('../controllers/mysql/pageController').pageController;
const bookController = require('../controllers/mysql/bookController').bookController;

const pageRouter = express.Router();
pageRouter.use(bodyParser.json());

pageRouter.route('/book/:bookId')
    // Returns id, title
    .get(authenticate.optionalVerifyUser,
        bookController.checkIsViewer,
        pageController.getPages)
    // Expects title
    .post(authenticate.verifyUser,
        bookController.checkIsAuthor,
        pageController.postPage);

pageRouter.route('/:pageId')
    // Returns id, title
    .get(authenticate.optionalVerifyUser,
        bookController.checkIsViewer,
        pageController.getPage)
    // Expects title
    .put(authenticate.verifyUser, 
        pageController.checkPage, 
        pageController.putPage)
    .delete(authenticate.verifyUser, 
        pageController.checkPage, 
        pageController.deletePage);

module.exports = pageRouter;