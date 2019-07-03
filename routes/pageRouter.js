const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const pageController = require('../controllers/mysql/pageController').pageController;

const pageRouter = express.Router();
pageRouter.use(bodyParser.json());

// Expects bookid, title
pageRouter.post('/',
    authenticate.verifyUser,
    pageController.checkBook,
    pageController.postPage);

// Returns id, title
pageRouter.get('/book/:bookId', pageController.getPages);

pageRouter.route('/:pageId')
    // Returns id, title
    .get(pageController.getPage)
    // Expects title
    .put(authenticate.verifyUser, 
        pageController.checkPage, 
        pageController.putPage)
    .delete(authenticate.verifyUser, 
        pageController.checkPage, 
        pageController.deletePage);

module.exports = pageRouter;