var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015')); // anadimos una semilla para cifrar la cookie y el cifrado sea mas aleatorio
app.use(session()); // instala middleware session
app.use(methodOverride('_method')); // permite convertir POST a PUT usando un parametro _method en el body del request
app.use(express.static(path.join(__dirname, 'public')));

// a la hora de gestionar sesiones, debemos guardar la pagina de referencia para saber donde hemos de redirigir al usuario
app.use(function(req, res, next){
    // si la pagina no es /login o /logout, guardamos la ruta en la variable de sesion 'redir'
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }
    // y pasamos esta variable a nuestras vistas, de este modo no hemos de pasar la sesion como un parametro de una funcion
    res.locals.session = req.session;

    // comprobar si han pasado mas de 2 minutos desde la ultima peticion HTTP
    var now = parseInt(new Date().getTime()/1000);
    var twoMinutes = now - req.session.timestamp;

    req.session.timestamp = parseInt(new Date().getTime()/1000); // actualiza el nuevo timestamp

    // si han pasado mas de 2 minutos desde la ultima peticion y el usuario esta logeado, destruir la sesion
    if(req.session.user && twoMinutes > 120)
    {
      delete req.session.user;
    }

    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
