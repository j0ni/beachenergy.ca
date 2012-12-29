"use strict";

/* global require, exports, module */

var markdown = require('../lib/markdown');

exports = module.exports = function (models) {
  var routes = {};

  routes.articles = require('./articles')(models.Article);
  routes.images = require('./images')(models.Image);
  routes.docs = require('./docs')(models.Doc);
  routes.links = require('./links')(models.Link);
  routes.users = require('./users')(models.User);
  routes.admin = require('./admin')(models);

  routes.index = function (req, res) {
    models.Article.find({ visible: true })
      .limit(3)
      .sort('-updated_at')
      .exec(function (error, articles) {
        if (error) {
          res.send(500, { error: error });
          return;
        }

        models.Image.find({ visible: true })
          .limit(4)
          .sort('-updated_at')
          .exec(function (error, images) {
            if (error) {
              res.send(500, { error: error });
              return;
            }

            models.Link.find({ visible: true })
              .sort('-updated_at')
              .exec(function (error, links) {
                if (error) {
                  res.send(500, { error: error });
                  return;
                }

                models.Doc.find({ visible: true })
                  .sort('title')
                  .exec(function (error, docs) {
                    if (error) {
                      res.send(500, { error: error });
                      return;
                    }

                    res.render('index', { articles: articles, images: images, links: links, docs: docs, markdown: markdown });

                  });

              });
          });

      });
  }

  return routes;
};
