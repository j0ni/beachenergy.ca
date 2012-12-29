"use strict";

/* global require, console */

var mongoose = require('mongoose'),
    config = require('./config'),
    app = require('./app'),
    http = require('http');

mongoose.connect(config.mongo.url);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
