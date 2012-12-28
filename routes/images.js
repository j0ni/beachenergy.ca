"use strict";

/* global require, console, exports */

var Image = require('../datamodel/image'),
    shared = require('./shared'),
    checkError = shared.checkError,
    checkSaveError = shared.checkSaveError,
    checkAuth = shared.checkAuth,
    files = require('./files');

exports.index = function (req, res) {
  files.index(req, res, Image, function (error, images) {
    if (checkError(error, req, res))
      return;

    images = images || [];
    res.render('images/index', { images: images });
  });
};

exports.show = function (req, res) {
  files.show(req, res, Image, function (error, image) {
    if (checkError(error, req, res))
      return;

    if (!image) {
      res.send(404, {error: 'not found'});
      return;
    }

    res.render('images/show', { image: image });
  });
};

exports.new = function (req, res) {
  files.new(req, res, Image);
};

exports.edit = function (req, res) {
  files.edit(req, res, Image);
};

exports.create = function (req, res) {
  files.create(req, res, Image, function (error, image) {
    if (checkSaveError(error, req, res))
      return;

    req.flash('success', 'Image succesffully uploaded');
    res.redirect('/');
  });
};

exports.update = function (req, res) {
  files.update(req, res, Image, function (error, image) {
    if (checkError(error, req, res))
      return;

    req.flash('success', 'Image successfully updated');
    res.redirect('/images/' + image.slug);
    return;
  });
};
