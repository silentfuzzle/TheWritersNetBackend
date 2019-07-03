const db = require('./db');
const mc = require('./mapController');

const SELECT_BOOK_REVIEWS =
`SELECT r.userid, u.displayname, r.id, r.rating, r.title, r.review, 
    r.timestamp, r.percentageread
FROM reviews AS r
JOIN users AS u ON u.id = r.userid
WHERE r.bookid = ? AND r.review > ''
ORDER BY r.timestamp ASC`;

const SELECT_AUTHOR_REVIEWS =
`SELECT r.bookid, b.title AS booktitle, r.id, r.rating, r.title, 
    r.review, r.timestamp, r.percentageread
FROM reviews AS r
JOIN books AS b ON b.id = r.bookid
WHERE r.bookid = ? AND r.review > ''
ORDER BY r.timestamp ASC`;

const SELECT_REVIEW =
`SELECT id, rating, title, review 
FROM reviews
WHERE id = ?`;

const SELECT_REVIEW_FROM_USER =
`SELECT id FROM reviews
WHERE userid = ? AND bookid = ?`;

const INSERT_REVIEW =
`INSERT INTO reviews (userid, bookid, rating, title, review, percentageread)
VALUES (?, ?, ?, ?, ?, ?)`;

const UPDATE_REVIEW =
`UPDATE reviews SET
rating = ?,
title = ?,
review = ?,
percentageread = ?
WHERE id = ?
LIMIT 1`;

const DELETE_REVIEW =
`DELETE FROM reviews
WHERE id = ?
LIMIT 1`;

const reviewController = {
    getBookReviews: (req,res,next) => {
        db.pool.query(SELECT_BOOK_REVIEWS, [req.params.bookId],
            (error, result) => db.sendResult(res, next, error, result));
    },
    getAuthorReviews: (req,res,next) => {
        db.pool.query(SELECT_AUTHOR_REVIEWS, [req.params.userId],
            (error, result) => db.sendResult(res, next, error, result));
    },
    getReview: (req,res,next) => {
        db.pool.query(SELECT_REVIEW, [req.params.reviewId], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    checkMap: (req,res,next) => {
        db.pool.query(mc.SELECT_MAP_FROM_USER, 
            [req.user.sqlid, req.body.bookid], 
            (error, result) => {
                if (error)
                    next(new Error(error));

                if (result) {
                    req.body.percentageread = result.percentageread;
                    next();
                } else {
                    db.sendUnauthorized(next);
                }
        });
    },
    checkReview: (req,res,next) => {
        db.pool.query(SELECT_REVIEW, [req.params.reviewId], 
            (error, result) => {
                if (error)
                    next(new Error(error));

                if (result) {
                    if (result.userid === req.user.sqlid) {
                        next();
                    }
                    else {
                        db.sendUnauthorized(next);
                    }
                }
                else {
                    db.sendUnauthorized(next);
                }
            });
    },
    postReview: (req,res,next) => {
        db.pool.query(SELECT_REVIEW_FROM_USER, 
            [req.user.sqlid, req.body.bookid], 
            (error, result) => {
                if (error)
                    next(new Error(error));

                if (result) {
                    db.sendUnauthorized(next);
                }
                else {
                    db.pool.query(INSERT_REVIEW,
                        [req.user.sqlid, req.body.bookid, 
                            req.body.rating, req.body.title, 
                            req.body.review, req.body.percentageread], 
                        (error, result) => 
                            db.sendId(res, next, error, result));
                }
            });
    },
    putReview: (req,res,next) => {
        db.pool.query(UPDATE_REVIEW, 
            [req.body.rating, req.body.title, req.body.review, 
                req.body.percentageread, req.params.reviewId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('updated');
            });
    },
    deleteReview: (req,res,next) => {
        db.pool.query(DELETE_REVIEW, [req.params.reviewId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('deleted');
            });
    }
}

exports = reviewController;