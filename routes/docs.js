"use strict";

/* global require, exports, module */

var files = require('./files'),
    shared = require('./shared'),
    checkError = shared.checkError,
    checkSaveError = shared.checkSaveError,
    checkAuth = shared.checkAuth;

exports = module.exports = function (Doc) {
  var routes = {};

  routes.index = function (req, res) {
    files.index(req, res, Doc, function (error, docs) {
      if (checkError(error, req, res))
        return;

      docs = docs || [];
      res.render('docs/index', { docs: docs });
    });
  };

  routes.show = function (req, res) {
    files.show(req, res, Doc, function (error, doc) {
      if (checkError(error, req, res))
        return;

      if (!doc) {
        res.send(404, {error: 'not found'});
        return;
      }

      res.redirect('/uploads'+doc.filename);
    });
  };

  routes.new = function (req, res) {
    files.new(req, res, Doc);
  };

  routes.edit = function (req, res) {
    files.edit(req, res, Doc);
  };

  routes.create = function (req, res) {
    files.create(req, res, Doc, function (error, doc) {
      if (checkSaveError(error, req, res))
        return;

      req.flash('success', 'Document succesffully uploaded');
      res.redirect('/');
    });
  };

  routes.update = function (req, res) {
    files.update(req, res, Doc, function (error, doc) {
      if (checkError(error, req, res))
        return;

      req.flash('success', 'Document successfully updated');
      res.redirect('/docs/' + doc.slug);
      return;
    });
  };

  return routes;
};
