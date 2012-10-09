"use strict";

/* global require, exports, console */

var Article = require('../datamodel/article')
  , _ = require('underscore')
  , util = require('util')
  , markdown = require('../lib/markdown')
  , shared = require('./shared')
  , checkAuth = shared.checkAuth
  , checkError = shared.checkError
  , checkSaveError = shared.checkSaveError
  , getQuery = shared.getQuery;

exports.index = function (req, res) {
  Article.find(getQuery(req), null, {limit: 3, sort: [['updated_at', -1]]}, function (error, docs) {
    if (checkError(error, res))
      return;

    docs = docs || [];
    res.render('articles/index', { articles: docs, markdown: markdown });
  });
};

exports.show = function (req, res) {
  var query = getQuery(req);
  query.slug = req.params['article'];
  console.log(util.inspect(query));

  Article.findOne(query, function (error, article) {
    if (checkError(error, res))
      return;

    if (!article) {
      req.flash('error', 'Article not found');
      res.redirect('/');
      return;
    }

    res.render('articles/show', { article: article, markdown: markdown });
  });
};

exports.new = function (req, res) {
  if (checkAuth(req, res, 'writer'))
    return;

  sendForm(new Article(), res);
};

exports.edit = function (req, res) {
  if (checkAuth(req, res, 'writer'))
    return;

  Article.findOne({slug: req.params['article']}, function (error, article) {
    if (checkError(error, res))
      return;

    if (!article) {
      req.flash('error', 'Article not found');
      req.redirect('/');
      return;
    }

    sendForm(article, res);
  });
}

exports.create = function (req, res) {
  if (checkAuth(req, res, 'writer'))
    return;

  buildArticle(req.body).save(function (error, article) {
    if (checkSaveError(error, req, res))
      return;

    req.flash('success', 'Article successfully created');
    res.redirect('/');
  });
}

exports.update = function (req, res) {
  if (checkAuth(req, res, 'writer', req.path))
    return;

  Article.findOne({slug: req.params['article']}, function (error, article) {
    if (checkError(error, res))
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
}

function buildArticle(params, article) {
  article = article || new Article();

  function getTags() {
    var tags = params['tags'] || '';
    tags = tags.split(/ +/);
    tags = _.select(tags, function (tag) { return tag.length > 0; });
    if (tags.length > 0)
      return tags;
  }

  var tags = getTags();

  article.title = params['title'] || article.title;
  article.author = params['author'] || article.author;
  article.content = params['content'] || article.content;
  article.tags = tags || article.tags

  return article;
}

function sendForm(article, res) {
  res.render('articles/form', { article: article });
}
