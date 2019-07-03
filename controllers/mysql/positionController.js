const db = require('./db');
const bc = require('./bookController');

const SELECT_POSITIONS =
`SELECT p.id, p.position, s.title, s.displaytitle, s.content
FROM positions AS p
JOIN sections AS s ON s.id = p.sectionid
WHERE p.pageid = 1
ORDER BY p.position ASC`;

const SELECT_BOOK =
`SELECT b.id AS bookid
FROM positions AS p
JOIN sections AS s ON s.id = p.sectionid
JOIN books AS b ON b.id = s.bookid
WHERE p.id = ?`;

const INSERT_POSITION =
`INSERT INTO positions (pageid, sectionid, position)
VALUES (?, ?, ?)`;

const UPDATE_POSITION =
`UPDATE positions SET
position = ?
WHERE id = ?
LIMIT 1`;

exports.DELETE_POSITIONS_FROM_BOOK =
`DELETE p
FROM positions AS p
INNER JOIN sections AS s ON p.sectionid = s.id
WHERE s.bookid = ?`;

exports.DELETE_POSITIONS_FROM_PAGE =
`DELETE FROM positions
WHERE pageid = ?`;

exports.DELETE_POSITIONS_FROM_SECTION =
`DELETE FROM positions
WHERE sectionid = ?`;

const DELETE_POSITION =
`DELETE FROM positions
WHERE id = ?
LIMIT 1`;

const positionController = {
    getPositions: (req,res,next) => {
        db.pool.query(SELECT_POSITIONS, [req.params.pageId],
            (error, result) => db.sendResult(res, next, error, result));
    },
    postPosition: (req,res,next) => {
        db.pool.query(INSERT_POSITION, [req.params.pageId, req.body.sectionid, req.body.position], 
            (error, result) => db.sendId(res, next, error, result));
    },
    checkBook: (req,res,next) => {
        db.pool.query(SELECT_BOOK, [req.params.positionId],
            (error, result) => {
                if (error)
                    next(new Error(error));

                if (result)
                    bc.checkAuthor(result.bookid, req.user.sqlid, next);
                else
                    db.sendUnauthorized(next);
            });
    },
    putPosition: (req,res,next) => {
        db.pool.query(UPDATE_POSITION, 
            [req.body.position, req.params.positionId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('updated');
            });
    },
    deletePosition: (req,res,next) => {
        db.pool.query(DELETE_POSITION, 
            [req.params.positionId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('deleted');
            });
    },
}

exports.positionController = positionController;