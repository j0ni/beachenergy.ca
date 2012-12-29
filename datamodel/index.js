"use strict";

/* global require, module, exports */

var UserSchema = require('./user'),
    LinkSchema = require('./link'),
    ArticleSchema = require('./article'),
    ImageSchema = require('./image'),
    DocSchema = require('./doc');

exports = module.exports = function (connection) {
  return {
    User: connection.model('User', UserSchema),
    Link: connection.model('Link', LinkSchema),
    Article: connection.model('Article', ArticleSchema),
    Image: connection.model('Image', ImageSchema),
    Doc: connection.model('Doc', DocSchema)
  };
};
