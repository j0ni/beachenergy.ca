"use strict";

var _ = require('underscore'),
    util = require('util'),
    markdown = require('../lib/markdown'),
    shared = require('./shared'),
    checkAuth = shared.checkAuth,
    checkError = shared.checkError,
    checkSaveError = shared.checkSaveError,
    getQuery = shared.getQuery,
    getTags = shared.getTags;

module.exports = function (Article) {
  var routes = {};

  routes.index = function (req, res) {
    Article.find(getQuery(req), null, { limit: 3, sort: [['updated_at', -1]] }, function (error, docs) {
      if (checkError(error, req, res))
        return;

      docs = docs || [];
      res.render('articles/index', { articles: docs, markdown: markdown });
    });
  };

  routes.show = function (req, res) {
    var query = getQuery(req);
    query.slug = req.params.article;

    Article.findOne(query, function (error, article) {
      if (checkError(error, req, res))
        return;

      if (!article) {
        req.flash('error', 'Article not found');
        res.redirect('/');
        return;
      }

      res.render('articles/show', { article: article, markdown: markdown });
    });
  };

  routes.new = function (req, res) {
    if (checkAuth(req, res, 'writer'))
      return;

    sendForm(new Article(), res);
  };

  routes.edit = function (req, res) {
    if (checkAuth(req, res, 'writer'))
      return;

    Article.findOne({ slug: req.params.article }, function (error, article) {
      if (checkError(error, req, res))
        return;

      if (!article) {
        req.flash('error', 'Article not found');
        req.redirect('/');
        return;
      }

      sendForm(article, res);
    });
  };

  routes.create = function (req, res) {
    if (checkAuth(req, res, 'writer'))
      return;

    buildArticle(req.body).save(function (error, article) {
      if (checkSaveError(error, req, res))
        return;

      req.flash('success', 'Article successfully created');
      res.redirect('/');
    });
  };

  routes.update = function (req, res) {
    if (checkAuth(req, res, 'writer', req.path))
      return;

    Article.findOne({ slug: req.params.article }, function (error, article) {
      if (checkError(error, req, res))
        return;

      if (!article) {
        req.flash('error', 'Article not found');
        res.redirect('/');
        return;
      }

      article = buildArticle(req.body, article);

      article.save(function (error, article) {
        if (checkSaveError(error, req, res))
          return;

        req.flash('success', 'Article successfully updated');
        res.redirect('/articles/' + article.slug);
        return;
      });
    });
  };

  function buildArticle(params, article) {
    article = article || new Article();

    article.title = params.title || article.title;
    article.author = params.author || article.author;
    article.content = params.content || article.content;
    article.tags = getTags(params) || article.tags;

    return article;
  }

  function sendForm(article, res) {
    res.render('articles/form', { article: article });
  }

  return routes;
};
