const passport = require('passport');
const db = require('./db');
const Users = require('../mongo/models/bareUsers');

const SELECT_COAUTHORS = 
`SELECT u.id, u.displayname, p.permissionid, t.name AS permission
FROM users AS u
JOIN permissions AS p ON p.userid = u.id
JOIN permissiontypes AS t ON t.id = p.permissionid
WHERE p.permissionid = 1 AND p.bookid = ?
ORDER BY permission`;

const SELECT_USER =
`SELECT * FROM users
WHERE id = ?`;

const INSERT_USER = 
`INSERT INTO users (username, displayname, email)
VALUES (?, ?, ?)`;

const UPDATE_USER =
`UPDATE users SET ?
WHERE id = ?
LIMIT 1`;

const UPDATE_EMAIL =
`UPDATE users SET
email = ?
WHERE id = ?
LIMIT 1`;

const userController = {
    getCoAuthors: (req,res,next) => {
        db.pool.query(SELECT_COAUTHORS, [req.params.bookId], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    getUser: (req,res,next) => {
        db.pool.query(SELECT_USER, [req.params.userId], 
            (error, result) => db.sendResult(res, next, error, result));
    },
    signup: (req,res,next) => {
        Users.register(new Users({ username: req.body.username }), 
            req.body.password, 
            (err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                }
                else {
                    db.pool.query(INSERT_USER, 
                        [req.body.username, req.body.username, req.body.email], 
                        (error, result) => {
                            if (error) next(error);

                            user.displayname = req.body.username;
                            user.sqlid = result.insertId;
                            
                            user.save((err, user) => {
                                if (err) {
                                    res.statusCode = 500;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({err: err});
                                    return;
                                }
                                passport.authenticate('local')(req, res, () => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({
                                        success: true,
                                        status: 'Registration Successful!'
                                    });
                                });
                            });
                        });
                }
            });
    },
    putUser: (req,res,next) => {
        db.pool.query(UPDATE_USER, [req.body, req.user.sqlid], 
            (error, result) => {
                if (error) next(error);
        
                res.send('updated');
            });
    },
    putSettings: (req,res,next) => {
        db.pool.query(UPDATE_EMAIL, [req.body.email, req.user.sqlid], 
            (error, result) => {
                if (error) next(error);
        
                res.send('updated');
            });

        if (req.body.newpassword) {
            Users.findById(req.user._id)
                .then((user) => {
                    return changePassword(req.body.oldpassword, req.body.newpassword);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    }
}

module.exports = userController;