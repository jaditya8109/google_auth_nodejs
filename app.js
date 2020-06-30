var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const passport = require("passport");

const passportSetup = require("./config/passport-setup");

const authRoutes = require("./routes/auth");


var app = express();

// view engine setup


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//connect to mongodb
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/googleAuth',{ useNewUrlParser: true}).then(() => console.log('connected')).catch((err)=>console.log('err'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
