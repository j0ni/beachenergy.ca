
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , auth = require('http-auth')
  , mongoose = require('mongoose')
  , config = require('./config');

var app = express();

app.configure('development', function () {
  app.use(express.logger({ format: ':method :url :status :remote-addr :response-time'}));
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

// require HTTP basic
var basic = auth({
  authRealm: "Beach Energy - Private Area",
  authList: ['beaches:beaches']
});

app.all('*', function (req, res, next) {
  basic.apply(req, res, function () { next(); });
});

mongoose.connect(config.mongo.url);

// Main routes
app.get('/', routes.index);
app.post('/', routes.create);
app.get('/new', routes.new);
app.get('/:article', routes.show);
app.post('/:article', routes.update)
app.get('/:article/edit', routes.edit);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
