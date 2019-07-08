const db = require('./db');
const pc = require('./pageController');
const sc = require('./sectionController');
const oc = require('./positionController');
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

// Check if the given user has permission to interact with the given book
// bookid - the id of the book
// userid - the id of the user
// permissionsQuery - the query to retrieve permissions with
// next - the next function in the route
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
            else
                db.sendUnauthorized(next);
        });
}

// Check if the given user is an author or coauthor of the given book
// bookid - the id of the book
// userid - the id of the user
// next - the next function in the route
exports.checkAuthor = (bookid, userid, next) => {
    this.checkPermission(bookid, userid, ac.SELECT_AUTHORS, next);
}

const bookController = {
    // Return all public books
    getBooks: (req,res,next) => {
        db.pool.query(SELECT_ALL_BOOKS,
            (error, result) => db.sendResult(res, next, error, result));
    },
    // Return all books the user published, co-authors, moderates, or has explicit permission to view
    getAuthoredBooks: (req,res,next) => {
        const sqlid = req.params.userId;
        db.pool.query(SELECT_AUTHORED_BOOKS, [sqlid, sqlid], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    // Return all books the user has opened and created a map of
    getOpenedBooks: (req,res,next) => {
        db.pool.query(SELECT_OPENED_BOOKS, [req.user.sqlid], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    // Return a specific book
    getBook: (req,res,next) => {
        db.sendResult(res, next, null, req.book);
    },
    // Check if the user is the owner of a specific book
    checkIsOwner: (req,res,next) => {
        db.pool.query(SELECT_BOOK_OWNER, req.params.bookId, 
            (error, result) => {
                if (error)
                    next(new Error(error));

                if (result.length > 0) {
                    if (result[0].ownerid !== req.user.sqlid)
                        // The user doesn't own this book
                        db.sendUnauthorized(next);
                    else
                        // The user has permission to perform the next function
                        next();
                }
                else
                    // The book doesn't exist
                    db.sendUnauthorized(next);
            });
    },
    // Check if the user is the owner or a co-author of a specific book
    checkIsAuthor: (req,res,next) => {
        this.checkAuthor(req.params.bookId, req.user.sqlid, next);
    },
    // Check if the user is the owner or a viewer of a specific book
    checkIsViewer: (req,res,next) => {
        db.pool.query(SELECT_BOOK, [req.params.bookId], 
            (error, result) => {
                if (error)
                    next(new Error(error));
                
                if (result && result.length > 0) {
                    // Save the book for the next function
                    req.book = result;

                    if (result[0].visibility === 0) {
                        // This is a private book, make sure the user has permission to view it
                        if (req.user)
                            this.checkPermission(req.params.bookId, 
                                req.user.sqlid, ac.SELECT_VIEWERS, next);
                        else
                            // The user isn't logged in
                            db.sendUnauthorized(next);
                    }
                }
                else
                    // The book doesn't exist
                    db.sendUnauthorized(next);
            });
    },
    // Add a new book to the database
    postBook: (req,res,next) => {
        let title = req.body.title;
        if (title) {
            // Make sure the title will fit in the database column
            title = db.truncateString(title);

            db.pool.query(INSERT_BOOK, [req.user.sqlid, title], 
                (error, result) => db.sendId(res, next, error, result));
        }
        else
            // The title field is required
            next(new Error('Please include \'title\''));
    },
    // Update a book in the database
    putBook: (req,res,next) => {
        new Promise((resolve, reject) => {
                if (req.body.startpageid > 0) {
                    // Make sure the given start page belongs to the book
                    db.pool.query(pc.SELECT_PAGE, [req.body.startpageid], 
                        (error, result) => {
                            if (error) reject(error);

                            if (result.length > 0 && result[0].bookid === req.params.bookId)
                                resolve(req.body.startpageid);
                            else
                                // The page doesn't exist or doesn't belong to the book
                                resolve(0);
                        });
                }
                else
                    resolve(0);
            })
            .then((startpageid) => {
                // Clean the sent data
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
            
                if (Object.keys(fields).length > 0) {
                    // Update the book only if accepted data was sent
                    db.pool.query(UPDATE_BOOK, [fields, req.params.bookId], 
                        (error, result) => db.sendResult(res, next, error, result));
                }
                else
                    next(new Error('No data sent'));
            })
            .catch(error => next(error));
    },
    // Delete a book and all the associated data from the database
    deleteBook: (req,res,next) => {
        db.pool.query(oc.DELETE_POSITIONS_FROM_BOOK + '; ' + 
                sc.DELETE_SECTIONS + '; ' + 
                pc.DELETE_PAGES + '; ' +
                ac.DELETE_PERMISSIONS + '; ' +
                DELETE_BOOK, 
            Array(6).fill(req.params.bookId), 
            (error, result) => db.sendResult(res, next, error, result));
    }
}

exports.bookController = bookController;