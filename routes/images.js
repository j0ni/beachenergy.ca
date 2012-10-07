"use strict";

/* global require, console, exports */

var Image = require('../datamodel/image');
var util = require('util');
var fs = require('fs');
var _ = require('underscore');
var shared = require('./shared');
var checkError = shared.checkError;
var checkSaveError = shared.checkSaveError;
var checkAuth = shared.checkAuth;

exports.index = function (req, res) {
  var limit = parseInt(req.query.limit) || 3;
  Image.find({visible: true})
    .limit(limit)
    .sort('-updated_at')
    .select('title slug tags updated_at filename')
    .exec(function (error, images) {
      if (checkError(error, res))
        return;

      images = images || [];
      res.render('images/index', { images: images });
    });
};

exports.show = function (req, res) {
  Image.findOne({visible: true, slug: req.params['image']}, function (error, image) {
    if (checkError(error, res))
      return;

    if (!image) {
      res.send(404, {error: 'not found'});
      return;
    }

    res.render('images/show', { image: image });
  });
};

exports.new = function (req, res) {
  sendForm(new Image(), res);
};

exports.edit = function (req, res) {
  if (req.params['image'] === undefined) {
    res.send(400, { error: 'no image slug provided' });
    return;
  }

  Image.findOne({slug: req.params['image']}, function (error, image) {
    if (checkError(error, res))
      return;

    if (!image) {
      res.send(404, { error: 'not found' });
      return;
    }

    sendForm(image, res);
  });
};

exports.create = function (req, res) {
  if (checkAuth(req, res))
    return;

  Image.create(buildImage(req), function (error, image) {
    if (checkError(error, res))
      return;

    res.redirect('/');
  });
};

exports.update = function (req, res) {
  if (checkAuth(req, res))
    return;

  Image.findOne({slug: req.params['image']}, function (error, image) {
    if (checkError(error, res))
      return;

    if (!image) {
      res.send(404, { error: 'not found' });
      return;
    }

    var oldFilename = image.filename;

    image = buildImage(req, image);
    image.save(function (error) {
      if (checkSaveError(error, res))
        return;

      fs.unlink('../public/uploads/' + oldFilename, function (error) {
        if (error) {
          console.error('error deleting old image file: ' + oldFilename);
        }

        res.redirect('/images/' + image.slug);
      });
    });
  });
};

function buildImage(req, image) {
  image = image || new Image();

  function getTags() {
    var tags = req.body['tags'] || '';
    tags = tags.split(/ +/);
    tags = _.select(tags, function (tag) { return tag.length > 0; });
    if (tags.length > 0)
      return tags;
  }

  var slug = req.body['slug'] || '';
  var tags = getTags();

  return {
    title: req.body['title'] || image.title,
    slug: slug.toLowerCase().replace(/ +/g, '-') || image.slug,
    tags: tags || image.tags,
    type: req.files.image.type || image.type,
    filename: req.files.image.path.substring(req.files.image.path.lastIndexOf('/')) || image.filename,
    visible: req.body['visible'] || image.visible
  };
}

function sendForm(image, res) {
  res.render('images/form', { image: image });
}
