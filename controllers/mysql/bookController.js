const db = require('./db');

const SELECT_ALL_BOOKS = 
`SELECT b.id, b.title, b.subtitle, b.ownerid, u.displayname, b.length, b.rating
FROM books AS b
JOIN users AS u ON u.id = b.ownerid`;

const SELECT_AUTHORED_BOOKS =
`SELECT b.id, b.title, b.startpageid, IFNULL(t.name, 'Author') AS permission
FROM books AS b
RIGHT JOIN permissions AS p ON p.bookid = b.id
JOIN permissiontypes AS t ON p.permissionid = t.id
WHERE (t.id = 1 AND p.userid = ?) OR b.ownerid = ?`;

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
    checkBook: (req,res,next) => {
        db.pool.query(SELECT_BOOK, req.params.bookId, 
            (error, result) => 
                db.sendCheck(error, next, result.ownerid, req.user.sqlid));
    },
    putBook: (req,res,next) => {
        db.pool.query(UPDATE_BOOK, [req.body, req.params.bookId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('updated');
            });
    },
    deleteBook: (req,res,next) => {
        db.pool.query(DELETE_BOOK, [req.params.bookId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('deleted');
            });
    }
}

module.exports = bookController;