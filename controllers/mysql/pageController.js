const db = require('./db');
const pc = require('./positionController');
const bc = require('./bookController');

exports.SELECT_PAGES =
`SELECT id, title
FROM pages
WHERE bookid = ?`;

const SELECT_PAGE =
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
        db.pool.query(SELECT_PAGES, [req.params.bookId],
            (error, result) => db.sendResult(res, next, error, result));
    },
    getPage: (req,res,next) => {
        db.pool.query(SELECT_PAGE, [req.params.pageId], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    checkBook: (req,res,next) => {
        bc.checkAuthor(req.body.bookid, req.user.sqlid, next);
    },
    checkPage: (req,res,next) => {
        db.pool.query(SELECT_PAGE, [req.params.pageId], 
            (error, result) => {
                if (error)
                    next(new Error(error));
                
                if (result)
                    bc.checkAuthor(result.bookid, req.user.sqlid, next);
                else
                    db.sendUnauthorized(next);
            });
    },
    postPage: (req,res,next) => {
        db.pool.query(INSERT_PAGE, [req.body.bookid, req.body.title], 
            (error, result) => db.sendId(res, next, error, result));
    },
    putPage: (req,res,next) => {
        db.pool.query(UPDATE_PAGE, 
            [req.body.title, req.params.pageId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('updated');
            });
    },
    deletePage: (req,res,next) => {
        db.pool.query(pc.DELETE_POSITIONS_FROM_PAGE + '; ' + DELETE_PAGE, 
            [req.params.pageId, req.params.pageId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('deleted');
            });
    }
}

exports.pageController = pageController;