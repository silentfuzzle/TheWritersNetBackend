const db = require('./db');
const pc = require('./pageController');
const sc = require('./sectionController');
const oc = require('./positionController');
const mc = require('./mapController');
const ac = require('./permissionController');

const SELECT_ALL_BOOKS = 
`SELECT b.id, b.title, b.subtitle, b.ownerid, u.displayname, b.length, b.rating
FROM books AS b
JOIN users AS u ON u.id = b.ownerid
WHERE b.length > 0 AND b.visibility = 1`;

const SELECT_AUTHORED_BOOKS =
`SELECT b.id, b.title, b.startpageid, IFNULL(t.name, 'Author') AS permission
FROM books AS b
LEFT JOIN permissions AS p ON p.bookid = b.id
LEFT JOIN permissiontypes AS t ON p.permissionid = t.id
WHERE p.userid = ? OR b.ownerid = ?`;

const SELECT_OPENED_BOOKS =
`SELECT m.bookid, b.title, m.percentageread, m.currpageid, r.id AS reviewid, r.rating
FROM maps AS m
JOIN books as b ON m.bookid = b.id
JOIN reviews AS r ON r.bookid = b.id
WHERE m.userid = ?`;

const SELECT_BOOK =
`SELECT b.id, b.startpageid, b.title, b.subtitle, b.description, b.visibility
FROM books AS b
WHERE b.id = ?`;

const SELECT_BOOK_OWNER =
`SELECT ownerid
FROM books
WHERE id = ?`;

const INSERT_BOOK =
`INSERT INTO books (ownerid, title)
VALUES (?, ?)`;

const UPDATE_BOOK =
`UPDATE books SET ?
WHERE id = ?
LIMIT 1`;

const DELETE_BOOK =
`DELETE FROM books
WHERE id = ?
LIMIT 1`;

exports.checkPermission = (bookid, userid, permissionsQuery, next) => {
    db.pool.query(SELECT_BOOK_OWNER + '; ' + permissionsQuery, 
        [bookid, bookid],
        (error, result) => {
            if (error) 
                next(new Error(error));
        
            if (result[0][0].ownerid === userid || 
                    result[1].some(u => u.userid === userid)) {
                next();
            }
            else {
                db.sendUnauthorized(next);
            }
        });
}

exports.checkAuthor = (bookid, userid, next) => {
    this.checkPermission(bookid, userid, ac.SELECT_AUTHORS, next);
}

const bookController = {
    getBooks: (req,res,next) => {
        db.pool.query(SELECT_ALL_BOOKS,
            (error, result) => db.sendResult(res, next, error, result));
    },
    getAuthoredBooks: (req,res,next) => {
        const sqlid = req.params.userId;
        db.pool.query(SELECT_AUTHORED_BOOKS, [sqlid, sqlid], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    getOpenedBooks: (req,res,next) => {
        db.pool.query(SELECT_OPENED_BOOKS, [req.user.sqlid], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    getBook: (req,res,next) => {
        db.sendResult(res, next, null, req.book);
    },
    checkIsOwner: (req,res,next) => {
        db.pool.query(SELECT_BOOK_OWNER, req.params.bookId, 
            (error, result) => 
                db.sendCheck(error, next, result[0].ownerid, req.user.sqlid));
    },
    checkIsAuthor: (req,res,next) => {
        this.checkAuthor(req.params.bookId, req.user.sqlid, next);
    },
    checkIsViewer: (req,res,next) => {
        db.pool.query(SELECT_BOOK, [req.params.bookId], 
            (error, result) => {
                if (error)
                    next(new Error(error));
                
                if (result && result.length > 0) {
                    req.book = result;
                    if (result[0].visibility === 0) {
                        if (req.user) {
                            this.checkPermission(req.params.bookId, 
                                req.user.sqlid, ac.SELECT_VIEWERS, next);
                        }
                        else {
                            db.sendUnauthorized(next);
                        }
                    }
                }
                else {
                    db.sendUnauthorized(next);
                }
            });
    },
    postBook: (req,res,next) => {
        let title = req.body.title;
        if (title) {
            title = db.truncateString(title);
            db.pool.query(INSERT_BOOK, [req.user.sqlid, title], 
                (error, result) => db.sendId(res, next, error, result));
        }
        else {
            next(new Error('Please include \'title\''));
        }
    },
    putBook: (req,res,next) => {
        new Promise((resolve, reject) => {
                if (req.body.startpageid > 0) {
                    db.pool.query(pc.SELECT_PAGE, [fields, req.params.bookId], 
                        (error, result) => {
                            if (error) reject(error);
        
                            if (result.length > 0 && result[0].bookid === req.params.bookId)
                                resolve(req.body.startpageid);
                            else
                                resolve(0);
                        });
                }
                else
                    resolve(0);
            })
            .then((startpageid) => {
                let fields = {};
                if (startpageid)
                    fields.startpageid = startpageid;
                if (req.body.title)
                    fields.title = db.truncateString(req.body.title);
                if (req.body.subtitle)
                    fields.subtitle = db.truncateString(req.body.subtitle);
                if (req.body.description)
                    fields.description = req.body.description;
                if (req.body.visibility)
                    fields.visibility = req.body.visibility ? 1 : 0;
            
                db.pool.query(UPDATE_BOOK, [fields, req.params.bookId], 
                    (error, result) => {
                        if (error) next(new Error(error));
                
                        res.send('updated');
                    });
            })
            .catch(error => next(error));
    },
    deleteBook: (req,res,next) => {
        db.pool.query(oc.DELETE_POSITIONS_FROM_BOOK + '; ' + 
                sc.DELETE_SECTIONS + '; ' + 
                pc.DELETE_PAGES + '; ' + 
                mc.DELETE_MAPS + '; ' +
                ac.DELETE_PERMISSIONS + '; ' +
                DELETE_BOOK, 
            Array(6).fill(req.params.bookId), 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('deleted');
            });
    }
}

exports.bookController = bookController;