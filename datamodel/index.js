"use strict";

/* global require, module, exports, console */

var UserSchema = require('./user'),
    LinkSchema = require('./link'),
    ArticleSchema = require('./article'),
    ImageSchema = require('./image'),
    DocSchema = require('./doc');

exports = module.exports = function (connection) {
  var models = {};

  models.User = getModel('User', UserSchema);
  models.Link = getModel('Link', LinkSchema);
  models.Article = getModel('Article', ArticleSchema);
  models.Image = getModel('Image', ImageSchema);
  models.Doc = getModel('Doc', DocSchema);

  function getModel(name, schema) {
    try {
      return connection.model(name);
    } catch (e) {
      return connection.model(name, schema);
    }
  }

  return models;
};
