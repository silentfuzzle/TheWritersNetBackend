const PERMISSION_TYPES = require('./permissionRouter');
const Books = require('../models/books');
const Permissions = require('../models/permissions');

const bookController = {
    getBooks: (req,res,next) => {
        Books.find({})
            .select({ "title": 1, "subtitle": 1, "ownerid": 1, "displayname": 1, "length": 1, "rating": 1 })
            .then((books) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(books);
            }, (err) => next(err))
            .catch((err) => next(err));
    },
    getAuthoredBooks: (req, res, next) => {
        Permissions.find({ userid: req.params.userId })
            .select({ "bookid": 1, "permissionid": 1 })
            .then((permissions) => {
    
                const bookids = permissions.map((p) => p.bookid);
    
                Books.find({ $or: [{ _id: { $in: bookids }}, { ownerid: req.user._id }]})
                    .select({ "startpageid": 1, "ownerid": 1, "title": 1 })
                    .then((books) => {
    
                        const finalBooks = books.map(b => {
                            let permission = "Owner";
                            if (b.ownerid === req.user._id) {
                                permission = PERMISSION_TYPES.find(
                                    t => t.id === permissions.find(
                                        p => p.bookid === b._id).permissionid).name;
                            }
                            return {
                                ...b,
                                permissiontype: permission
                            }
                        });
    
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(finalBooks);
    
                    }, (err) => next(err))
                    .catch((err) => next(err));
                    
            }, (err) => next(err))
            .catch((err) => next(err));
    },
    postBook: (req,res,next) => {
        req.body.displayname = req.user.displayname;
        req.body.ownerid = req.user._id;

        Books.create(req.body)
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            }, (err) => next(err))
            .catch((err) => next(err));
    }
}

module.exports = bookController;