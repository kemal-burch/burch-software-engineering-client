var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var promise = require('bluebird');
var logger = require('morgan');
var config = require('./config');


var users = require('./routes/users');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

mongoose.Promise = promise;

mongoose.connect(config.atlasdb, {server:{auto_reconnect:true}});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection-error'));
db.once('open', function () {
    console.log('Connected to tabtalent productiondb');
});

db.on('disconnected', function() {
    console.log('disconnected');
    console.log('dbURI is: '+config.atlasdb);
    mongoose.connect(config.atlasdb,
        {server: {auto_reconnect:true,
                socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }},
            replset: { socketOptions: { keepAlive: 1 } }});
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

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
