"use strict";

var shared = require('./shared'),
    checkError = shared.checkError,
    checkSaveError = shared.checkSaveError,
    checkAuth = shared.checkAuth,
    files = require('./files');

module.exports = function (Image) {
  var routes = {};

  routes.index = function (req, res) {
    files.index(req, res, Image, function (error, images) {
      if (checkError(error, req, res))
        return;

      images = images || [];
      res.render('images/index', { images: images });
    });
  };

  routes.show = function (req, res) {
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

  routes.new = function (req, res) {
    files.new(req, res, Image);
  };

  routes.edit = function (req, res) {
    files.edit(req, res, Image);
  };

  routes.create = function (req, res) {
    files.create(req, res, Image, function (error, image) {
      if (checkSaveError(error, req, res))
        return;

      req.flash('success', 'Image succesffully uploaded');
      res.redirect('/');
    });
  };

  routes.update = function (req, res) {
    files.update(req, res, Image, function (error, image) {
      if (checkError(error, req, res))
        return;

      req.flash('success', 'Image successfully updated');
      res.redirect('/images/' + image.slug);
      return;
    });
  };

  return routes;
};
