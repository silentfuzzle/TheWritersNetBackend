const db = require('./db');
const pc = require('./positionController');
const bc = require('./bookController');
const mc = require('./mapController');

exports.SELECT_PAGES =
`SELECT id, title
FROM pages
WHERE bookid = ?`;

exports.SELECT_PAGE =
`SELECT id, bookid, title
FROM pages
WHERE id = ?`;

const INSERT_PAGE =
`INSERT INTO pages (bookid, title)
VALUES (?, ?)`

const UPDATE_PAGE =
`UPDATE pages SET
title = ?
WHERE id = ?
LIMIT 1`;

exports.DELETE_PAGES =
`DELETE FROM pages
WHERE bookid = ?`;

const DELETE_PAGE = 
`DELETE FROM pages
WHERE id = ?
LIMIT 1`;

const pageController = {
    getPages: (req,res,next) => {
        db.pool.query(this.SELECT_PAGES, [req.params.bookId],
            (error, result) => db.sendResult(res, next, error, result));
    },
    getPage: (req,res,next) => {
        db.pool.query(this.SELECT_PAGE, [req.params.pageId], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    checkPage: (req,res,next) => {
        db.pool.query(SELECT_PAGE, [req.params.pageId], 
            (error, result) => {
                if (error)
                    next(new Error(error));
                
                if (result.length > 0) {
                    const bookid = result[0].bookid;
                    req.bookid = bookid;
                    bc.checkAuthor(bookid, req.user.sqlid, next);
                }
                else
                    db.sendUnauthorized(next);
            });
    },
    postPage: (req,res,next) => {
        let title = req.body.title;
        if (title) {
            title = db.truncateString(title);

            db.pool.query(INSERT_PAGE, [req.params.bookId, title], 
                (error, result) => db.sendId(res, next, error, result));
        }
        else
            next(new Error('Please include \'title\''));
    },
    putPage: (req,res,next) => {
        let title = req.body.title;
        if (title) {
            title = db.truncateString(title);

            db.pool.query(UPDATE_PAGE, [title, req.params.pageId], 
                (error, result) => db.sendResult(res, next, error, result));
        }
        else
            next(new Error('Please include \'title\''));
    },
    deletePage: (req,res,next) => {
        const pageid = req.params.pageId;
        db.pool.query(pc.DELETE_POSITIONS_FROM_PAGE + '; ' + 
                DELETE_PAGE + '; ' + 
                mc.SET_UPDATE, 
            [pageid, pageid, req.bookid], 
            (error, result) => db.sendResult(res, next, error, result));
    }
}

exports.pageController = pageController;