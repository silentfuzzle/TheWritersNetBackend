const mysql = require('mysql');
const config = require('../../config');

const STRING_MAX = 255;

exports.pool = mysql.createPool(config.mysqlConfig);

exports.truncateString = (value) => {
    if (value.length >= STRING_MAX);
        return value.substring(0, STRING_MAX - 1);
    
    return value;
}

exports.sendResult = (res, next, error, result) => {
    if (error) next(new Error(error));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
};

exports.sendId = (res, next, error, result) => {
    if (error) next(new Error(error));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ id: result.insertId });
}

exports.sendUnauthorized = (next) => {
    var err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
}

exports.sendCheck = (error, next, userid1, userid2) => {
    if (error) {
        var err = new Error(error);
        err.status = 500;
        return next(err);
    }
    else if (userid1 !== userid2)
        this.sendUnauthorized(next);
    else
        next();
}