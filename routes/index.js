"use strict";

/* global require, exports, module */

var markdown = require('../lib/markdown'),
    async = require('async');

exports = module.exports = function (models) {
  var routes = {};

  routes.articles = require('./articles')(models.Article);
  routes.images = require('./images')(models.Image);
  routes.docs = require('./docs')(models.Doc);
  routes.links = require('./links')(models.Link);
  routes.users = require('./users')(models.User);
  routes.admin = require('./admin')(models);
  routes.forms = require('./forms')();

  routes.index = function (req, res) {
    var visible = { visible: true };

    async.parallel([
      function (callback) {
        models.Article.find(visible)
          .limit(3)
          .sort('-updated_at')
          .exec(callback);
      },
      function (callback) {
        models.Image.find(visible)
          .limit(4)
          .sort('-updated_at')
          .exec(callback);
      },
      function (callback) {
        models.Link.find(visible)
          .sort('-updated_at')
          .exec(callback);
      },
      function (callback) {
        models.Doc.find(visible)
          .sort('title')
          .exec(callback);
      }
    ], function (error, results) {
      if (error) {
        res.send(500, { error: error });
        return;
      }

      res.render('index', {
        articles: results[0],
        images: results[1],
        links: results[2],
        docs: results[3],
        markdown: markdown
      });
    });
  }

  return routes;
};
