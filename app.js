
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , auth = require('http-auth')
  , mongoose = require('mongoose')
  , config = require('./config');

var app = express();

app.configure('development', function () {
  app.use(express.logger({ format: ':method :url :status :remote-addr :response-time'}));
});

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({
    uploadDir: __dirname + '/public/uploads',
    keepExtensions: true
  }));
  app.use(express.limit('5mb'));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
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
app.get('/articles', routes.articles.index);
app.post('/articles', routes.articles.create);
app.get('/articles/new', routes.articles.new);
app.get('/articles/:article', routes.articles.show);
app.post('/articles/:article', routes.articles.update);
app.get('/articles/:article/edit', routes.articles.edit);

app.get('/images', routes.images.index);
app.post('/images', routes.images.create);
app.get('/images/new', routes.images.new);
app.get('/images/:image', routes.images.show);
app.post('/images/:image', routes.images.update);
app.get('/images/:image/edit', routes.images.edit);


http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
