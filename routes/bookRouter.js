const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const bookController = require('../controllers/mysql/bookController').bookController;

const bookRouter = express.Router();
bookRouter.use(bodyParser.json());

bookRouter.route('/')
    // Returns book id, subtitle, ownerid, displayname, username, length, rating
    .get(bookController.getBooks)
    // Expects book title
    .post(authenticate.verifyUser,
        bookController.postBook);

// Returns book id, title, startpageid, permission
bookRouter.get('/authored/:userId',
    bookController.getAuthoredBooks);

// Returns bookid, title, percentageread, currpageid, reviewid, rating
bookRouter.get('/opened', 
    authenticate.verifyUser,
    bookController.getOpenedBooks);

bookRouter.route('/:bookId')
    // Returns book id, startpageid, title, subtitle, description, visibility
    .get(authenticate.optionalVerifyUser,
        bookController.checkIsViewer,
        bookController.getBook)
    // Expects book startpageid, title, subtitle, description, visibility
    .put(authenticate.verifyUser,
        bookController.checkIsAuthor,
        bookController.putBook)
    .delete(authenticate.verifyUser, 
        bookController.checkIsOwner,
        bookController.deleteBook);

module.exports = bookRouter;