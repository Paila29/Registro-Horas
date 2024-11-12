var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


/*CONECCION CON DATABASE*/ 
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const database = require('./config/database');
/*SEGUNDO CODE PARA CONECCION*/
mongoose.set('strictQuery', true);
mongoose.connect(database.url)
.then(()=>console.log('MongoDb connected'))
.catch(()=>console.log("Connection Error"))
/**/ 


var indexRouter = require('./routes/index');

var usersRouter = require('./routes/hours');
var usersRouterU = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//seteo de las direcciones para el funcionamiento del router 
app.use('/students', usersRouter);
app.use('/user', usersRouterU);


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
