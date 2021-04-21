var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let flash = require('express-flash');
let session = require('express-session');
let mysql = require('mysql');
let connection = require('./lib/db');

 const db = require("./models");
 //const initRoutes = require("./routes/tutorial.routes");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var trolleyAPI = require('./routes/API/trolley')
var nurseAPI = require('./routes/API/nurse')
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
//app.use('/js', express.static(__dirname + '/node_modules/bootstrap/js/dist'));


app.use(express.urlencoded({ extended: true }));
//initRoutes(app);

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.use(session({
  cookie:{maxAge:60000},
  store:new session.MemoryStore,
  saveUninitialized : true,
  resave: 'true',
  secret:'secret'

}))
app.use(flash());




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trolley',trolleyAPI);
app.use('/nurse',nurseAPI);
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
