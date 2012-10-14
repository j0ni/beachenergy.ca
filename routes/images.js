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
var getQuery = shared.getQuery;
var getTags = shared.getTags;

exports.index = function (req, res) {
  var limit = parseInt(req.query.limit) || 5;
  Image.find(getQuery(req))
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
  var query = getQuery(req);
  query.slug = req.params['image'];

  Image.findOne(query, function (error, image) {
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
  if (checkAuth(req, res, 'writer'))
    return;

  sendForm(new Image(), res);
};

exports.edit = function (req, res) {
  if (checkAuth(req, res, 'writer'))
    return;

  Image.findOne({slug: req.params['image']}, function (error, image) {
    if (checkError(error, res))
      return;

    if (!image) {
      req.flash('error', 'Image not found');
      res.redirect('/');
      return;
    }

    sendForm(image, res);
  });
};

exports.create = function (req, res) {
  if (checkAuth(req, res, 'writer'))
    return;

  buildImage(req).save(function (error, image) {
    if (checkSaveError(error, req, res))
      return;

    req.flash('success', 'Image succesffully uploaded');
    res.redirect('/');
  });
};

exports.update = function (req, res) {
  if (checkAuth(req, res, 'writer', req.path))
    return;

  Image.findOne({slug: req.params['image']}, function (error, image) {
    if (checkError(error, res))
      return;

    if (!image) {
      req.flash('error', 'Image not found');
      res.redirect('/');
      return;
    }

    var oldFilename = image.filename;

    image = buildImage(req, image);

    image.save(function (error, image) {
      if (checkSaveError(error, req, res))
        return;

      fs.unlink('./public/uploads' + oldFilename, function (error) {
        if (error) {
          console.error('error deleting old image file: ' + oldFilename);
        }

        req.flash('success', 'Image successfully updated');
        res.redirect('/images/' + image.slug);
        return;
      });
    });
  });
};

function buildImage(req, image) {
  image = image || new Image();

  image.title = req.body['title'] || image.title;
  image.tags = getTags(req.body) || image.tags;
  image.type = req.files.image.type || image.type;
  image.filename = req.files.image.path.substring(req.files.image.path.lastIndexOf('/')) || image.filename;

  return image;
}

function sendForm(image, res) {
  res.render('images/form', { image: image });
}
