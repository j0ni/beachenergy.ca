"use strict";

/* global require, exports */

var Article = require('../datamodel/article');
var Image = require('../datamodel/image');
var markdown = require('../lib/markdown');

exports.articles = require('./articles');
exports.images = require('./images');
exports.users = require('./users');
exports.admin = require('./admin');

exports.index = function (req, res) {
  Article.find({visible: true})
    .limit(3)
    .sort('-updated_at')
    .exec(function (error, articles) {
      if (error) {
        res.send(500, { error: error });
        return;
      }

      Image.find({visible: true})
        .limit(4)
        .sort('-updated_at')
        .exec(function (error, images) {
          if (error) {
            res.send(500, { error: error });
            return;
          }

          res.render('index', { articles: articles, images: images, markdown: markdown });
        });

    });
}
