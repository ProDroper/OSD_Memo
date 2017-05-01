var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



mongoose.connect('mongodb://joon:1234@ds153730.mlab.com:53730/mern');

var Schema = mongoose.Schema;

var MemoSchema = new Schema({
    title     : String,
    body      : String,
    date      : {type: Date, default:Date.now}
});

var privateMemo = mongoose.model('privateMemo', MemoSchema);
var publicMemo = mongoose.model('publicMemo', MemoSchema);

/* GET home page. */
app.get('/', function(req, res) {
  res.redirect('/public');
});

app.get('/public', function(req, res) {
    if (req.query.title) {
        console.log(req.query.title)
        publicMemo.find({title: new RegExp(req.query.title, "i")}, (err, memos) => {
            res.render('public', {memos: memos});
        })
    }
    publicMemo.find({}, (err, memos) => {
        res.render('public', {memos: memos});
    })
});

app.get('/private', function(req, res) {
    if (req.query.title) {
        console.log(req.query.title)
        privateMemo.find({title: new RegExp(req.query.title, "i")}, (err, memos) => {
            res.render('private', {memos: memos});
        })
    }
    privateMemo.find({}, (err, memos) => {
        res.render('private', {memos: memos});
    })
});

app.get('/:id/add', (req, res) => {
    res.render('add', {type: req.params.id})
});

app.post('/public', function(req, res) {
    var newMemo = new publicMemo();
    newMemo.title = req.body.title;
    newMemo.body = req.body.body;
    newMemo.save((err) => {
      if(err) console.log(err);
      console.log(newMemo)
      res.redirect('/public');
    });
});

app.post('/private', function(req, res) {
  var newMemo = new privateMemo();
    newMemo.title = req.body.title;
    newMemo.body = req.body.body;
    newMemo.save((err) => {
      if(err) console.log(err);
      res.redirect('/private');
    });
});

app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
