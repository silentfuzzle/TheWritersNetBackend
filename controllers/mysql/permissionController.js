const db = require('./db');
const bc = require('./bookController');

const SELECT_PERMISSION_TYPES =
`SELECT * FROM permissiontypes`;

const SELECT_PERMISSIONS =
`SELECT p.id, u.username, u.displayname, p.permissionid
FROM permissions AS p
JOIN users AS u ON u.id = p.userid
WHERE p.bookid = ?`;

const SELECT_AUTHORS_AND_MODERATORS =
`SELECT userid FROM permissions
WHERE (permissionid = 1 OR permissionid = 2) AND bookid = ?`;

exports.SELECT_AUTHORS =
`SELECT userid FROM permissions
WHERE permissionid = 1 AND bookid = ?`;

exports.SELECT_VIEWERS = 
`SELECT userid FROM permissions
WHERE bookid = ?`;

const INSERT_PERMISSION =
`INSERT INTO permissions (bookid, userid, permissionid)
VALUES (?, ?, ?)`;

const UPDATE_PERMISSION =
`UPDATE permissions SET
permissionid = ?
WHERE id = ?
LIMIT 1`;

exports.DELETE_PERMISSIONS =
`DELETE FROM permissions
WHERE bookid = ?`;

const DELETE_PERMISSION =
`DELETE FROM permissions
WHERE id = ?
LIMIT 1`;

const permissionController = {
    getPermissionTypes:  (req,res,next) => {
        db.pool.query(SELECT_PERMISSION_TYPES,
            (error, result) => db.sendResult(res, next, error, result));
    },
    checkIsModerator: (req,res,next) => {
        const bookid = req.params.bookId;
        db.pool.query(bc.SELECT_BOOK_OWNER + '; ' + SELECT_AUTHORS_AND_MODERATORS, 
            [bookid, bookid],
            (error, result) => bc.returnNext(req.user.sqlid, error, result, next));
    },
    getPermissions: (req,res,next) => {
        db.pool.query(SELECT_PERMISSIONS, [req.params.bookId],
            (error, result) => db.sendResult(res, next, error, result));
    },
    postPermission:  (req,res,next) => {
        db.pool.query(INSERT_PERMISSION,
            [req.body.bookid, req.user.sqlid, req.body.permissionid], 
            (error, result) => db.sendId(res, next, error, result));
    },
    putPermission: (req,res,next) => {
        db.pool.query(UPDATE_PERMISSION, [req.body.permissionid, req.params.pId], 
            (error, result) => {
                if (error) 
                    next(new Error(error));
        
                res.send('updated');
            });
    },
    deletePermission: (req,res,next) => {
        db.pool.query(DELETE_PERMISSION, [req.params.pId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('deleted');
            });
    }
}

exports.permissionController = permissionController;