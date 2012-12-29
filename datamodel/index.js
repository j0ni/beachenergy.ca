"use strict";

/* global require, module, exports, console */

var UserSchema = require('./user'),
    LinkSchema = require('./link'),
    ArticleSchema = require('./article'),
    ImageSchema = require('./image'),
    DocSchema = require('./doc');

exports = module.exports = function (connection) {
  var models = {};

  models.User = getModel(connection, 'User', UserSchema);
  models.Link = getModel(connection, 'Link', LinkSchema);
  models.Article = getModel(connection, 'Article', ArticleSchema);
  models.Image = getModel(connection, 'Image', ImageSchema);
  models.Doc = getModel(connection, 'Doc', DocSchema);

  return models;
};

function getModel(connection, name, schema) {
  try {
    return connection.model(name);
  } catch (e) {
    return connection.model(name, schema);
  }
};
