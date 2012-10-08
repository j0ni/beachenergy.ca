"use strict";

/* global require, exports, console */

var Article = require('../datamodel/article')
  , _ = require('underscore')
  , util = require('util')
  , markdown = require('../lib/markdown')
  , shared = require('./shared')
  , checkAuth = shared.checkAuth
  , checkError = shared.checkError
  , checkSaveError = shared.checkSaveError;

exports.index = function (req, res) {
  Article.find({visible: true}, null, {limit: 3, sort: [['updated_at', -1]]}, function (error, docs) {
    if (checkError(error, res))
      return;

    docs = docs || [];
    res.render('articles/index', { articles: docs, markdown: markdown });
  });
};

exports.show = function (req, res) {
  Article.findOne({visible: true, slug: req.params['article']}, function (error, article) {
    if (checkError(error, res))
      return;

    if (!article) {
      res.send(404, {error: 'not found'});
      return;
    }

    res.render('articles/show', { article: article, markdown: markdown });
  });
};

exports.new = function (req, res) {
  sendForm(new Article(), res);
};

exports.edit = function (req, res) {
  if (req.params['article'] === undefined) {
    res.send(400, {error: 'no article provided'});
    return;
  }

  Article.findOne({slug: req.params['article']}, function (error, article) {
    if (checkError(error, res))
      return;

    if (!article) {
      res.send(404, {error: 'not found'});
      return;
    }

    sendForm(article, res);
  });
}

exports.create = function (req, res) {
  if (checkAuth(req, res))
    return;

  Article.create(buildArticle(req.body), function (error, article) {
    if (checkSaveError(error, res))
      return;

    res.redirect('/');
  });
}

exports.update = function (req, res) {
  if (checkAuth(req, res))
    return;

  Article.findOneAndUpdate({slug: req.params['article']}, buildArticle(req.body), function (error, article) {
    if (checkSaveError(error, res))
      return;

    if (!article) {
      res.send(404, {error: 'not found'});
      return;
    }

    res.redirect('/articles/' + article.slug);
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

  var slug = params['slug'] || '';
  var tags = getTags();

  return {
    title: params['title'] || article.title,
    slug: slug.toLowerCase().replace(/ +/g, '-') || article.slug,
    author: params['author'] || article.author,
    content: params['content'] || article.content,
    visible: params['visible'] || article.visible,
    tags: tags || article.tags
  };
}


function sendForm(article, res) {
  res.render('articles/form', { article: article });
}
