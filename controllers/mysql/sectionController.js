const db = require('./db');
const pc = require('./positionController');
const bc = require('./bookController');

const SELECT_SECTIONS =
`SELECT s.id, s.title, SUBSTRING(s.content, 1, 100) AS content, 
    COUNT(DISTINCT p.id) AS numpages
FROM sections AS s
JOIN pages AS p ON p.bookid = s.bookid
WHERE s.bookid = ?
GROUP BY s.id`;

const SELECT_SECTION =
`SELECT id, bookid, title, displaytitle, content
FROM sections
WHERE id = ?`;

const INSERT_SECTION =
`INSERT INTO sections (bookid, title, displaytitle, content)
VALUES (?, ?, ?, ?)`;

const UPDATE_SECTION =
`UPDATE sections SET
title = ?,
displaytitle = ?,
content = ?
WHERE id = ?
LIMIT 1`;

const DELETE_SECTION =
`DELETE FROM sections
WHERE id = ?
LIMIT 1`;

exports.DELETE_SECTIONS =
`DELETE FROM sections
WHERE bookid = ?`;

const sectionController = {
    getSections: (req,res,next) => {
        db.pool.query(SELECT_SECTIONS, [req.params.bookId],
            (error, result) => db.sendResult(res, next, error, result));
    },
    getSection: (req,res,next) => {
        db.pool.query(SELECT_SECTION, [req.params.sectionId], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    postSection: (req,res,next) => {
        db.pool.query(INSERT_SECTION, 
            [req.params.bookId, req.body.title, req.body.displaytitle, 
                req.body.content], 
            (error, result) => {
                if (!error) {
                    const pages = req.body.content.match(/\[\d+\]/g);
                    result.insertId;
                }

                db.sendId(res, next, error, result);
            });
    },
    checkBook: (req,res,next) => {
        db.pool.query(SELECT_SECTION, [req.params.sectionId], 
            (error, result) => {
                if (error)
                    next(new Error(error));

                if (result)
                    bc.checkAuthor(result.bookid, req.user.sqlid, next);
                else
                    db.sendUnauthorized(next);
            });
    },
    putSection: (req,res,next) => {
        db.pool.query(UPDATE_SECTION, 
            [req.body.title, req.body.displaytitle, req.body.content, 
                req.params.sectionId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('updated');
            });
    },
    deleteSection: (req,res,next) => {
        db.pool.query(pc.DELETE_POSITIONS_FROM_SECTION + '; ' + DELETE_SECTION, 
            [req.params.sectionId, req.params.sectionId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('deleted');
            });
    }
}

exports.sectionController = sectionController;