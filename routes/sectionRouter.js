const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const sectionController = require('../controllers/mysql/sectionController').sectionController;
const bookController = require('../controllers/mysql/bookController').bookController;

const sectionRouter = express.Router();
sectionRouter.use(bodyParser.json());

sectionRouter.route('/book/:bookId')
    // Returns id, title, content, numpages
    .get(authenticate.verifyUser,
        bookController.checkIsAuthor,
        sectionController.getSections)
    // Expects title, displaytitle, content
    .post(authenticate.verifyUser,
        bookController.checkIsAuthor,
        sectionController.postSection);

sectionRouter.route('/:sectionId')
    // Returns id, bookid, title, displaytitle, content
    .get(sectionController.getSection)
    // Expects title, displaytitle, content
    .put(authenticate.verifyUser,
        sectionController.checkBook,
        sectionController.putSection)
    .delete(authenticate.verifyUser,
        sectionController.checkBook,
        sectionController.deleteSection);

module.exports = sectionRouter;