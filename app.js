var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config');

const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const bookRouter = require('./routes/bookRouter');
//const mapRouter = require('./routes/mapRouter');
//const pageRouter = require('./routes/pageRouter');
//const permissionRouter = require('./routes/permissionRouter');
//const reviewRouter = require('./routes/reviewRouter');
//const sectionRouter = require('./routes/sectionRouter');
//const positionRouter = require('./routes/positionRouter');

// Setup mongodb
const url = config.mongoConfig.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => { console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/books', bookRouter);
//app.use('/maps', mapRouter);
//app.use('/pages', pageRouter);
//app.use('/permissions', permissionRouter);
//app.use('/reviews', reviewRouter);
//app.use('/sections', sectionRouter);
//app.use('/positions', positionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
