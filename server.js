"use strict";

/* global require, console */

var mongoose = require('mongoose'),
    config = require('./config'),
    makeApp = require('./app'),
    http = require('http');

var connection = mongoose.createConnection(config.mongo.url);

connection.once('open', function () {
  var app = makeApp(connection);

  http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
  });
});

connection.on('error', function (error) {
  console.error(error);
});
