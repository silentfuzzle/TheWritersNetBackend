const db = require('./db');
const pc = require('./pageController');
const sc = require('./sectionController');
const mc = require('./mapController');
const ac = require('./permissionController');

const SELECT_ALL_BOOKS = 
`SELECT b.id, b.title, b.subtitle, b.ownerid, u.displayname, b.length, b.rating
FROM books AS b
JOIN users AS u ON u.id = b.ownerid`;

const SELECT_AUTHORED_BOOKS =
`SELECT b.id, b.title, b.startpageid, IFNULL(t.name, 'Author') AS permission
FROM books AS b
RIGHT JOIN permissions AS p ON p.bookid = b.id
JOIN permissiontypes AS t ON p.permissionid = t.id
WHERE ((t.id = 1 OR t.id = 2) AND p.userid = ?) OR b.ownerid = ?`;

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

exports.returnNext = (userid, error, result, next) => {
    if (error) 
        next(new Error(error));

    if (result[0].ownerid === userid || 
            result[1].some(u => u.userid === userid)) {
        next();
    }
    else {
        db.sendUnauthorized(next);
    }
}

exports.checkAuthor = (bookid, userid, next) => {
    db.pool.query(SELECT_BOOK_OWNER + '; ' + pc.SELECT_AUTHORS, 
        [bookid, bookid],
        (error, result) => this.returnNext(userid, error, result, next));
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
        db.pool.query(SELECT_BOOK, [req.params.bookId], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    postBook: (req,res,next) => {
        db.pool.query(INSERT_BOOK, [req.user.sqlid, req.body.title], 
            (error, result) => db.sendId(res, next, error, result));
    },
    checkIsOwner: (req,res,next) => {
        db.pool.query(SELECT_BOOK_OWNER, req.params.bookId, 
            (error, result) => 
                db.sendCheck(error, next, result.ownerid, req.user.sqlid));
    },
    checkIsAuthor: (req,res,next) => {
        this.checkAuthor(req.params.bookId, req.user.sqlid, next);
    },
    putBook: (req,res,next) => {
        db.pool.query(UPDATE_BOOK, [req.body, req.params.bookId], 
            (error, result) => {
                if (error) 
                    next(new Error(error));
        
                res.send('updated');
            });
    },
    deleteBook: (req,res,next) => {
        db.pool.query(sc.DELETE_POSITIONS_FROM_BOOK + '; ' + 
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