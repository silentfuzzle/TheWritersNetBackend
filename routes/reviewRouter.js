const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const reviewController = require('../controllers/mysql/reviewController');

const reviewRouter = express.Router();
reviewRouter.use(bodyParser.json());

// Expects bookid, rating, title, review
reviewRouter.post('/',
    authenticate.verifyUser, 
    reviewController.checkMap,
    reviewController.postReview);

// Returns review id, userid, displayname, rating, title, review, timestamp, percentageread
reviewRouter.get('/book/:bookId', reviewController.getBookReviews);

// Returns review id, bookid, booktitle, rating, title, review, timestampt, percentageread
reviewRouter.get('/author/:userId', reviewController.getAuthorReviews);

reviewRouter.route('/:reviewId')
    // Returns id, rating, title, review
    .get(reviewController.getReview)
    // Expects rating, title, review
    .put(authenticate.verifyUser,
        reviewController.checkMap,
        reviewController.checkReview,
        reviewController.putReview)
    .delete(authenticate.verifyUser,
        reviewController.checkReview,
        reviewController.deleteReview);

module.exports = reviewRouter;