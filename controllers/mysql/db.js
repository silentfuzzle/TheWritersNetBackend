const mysql = require('mysql');
const config = require('../../config');

exports.pool = mysql.createPool(config.mysqlConfig);

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