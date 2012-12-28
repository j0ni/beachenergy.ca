"use strict";

/* global require, exports, console */

var shared = require('./shared'),
    getQuery = shared.getQuery,
    checkError = shared.checkError,
    checkAuth = shared.checkAuth,
    getTags = shared.getTags,
    checkSaveError = shared.checkSaveError,
    fs = require('fs');

exports.index = function (req, res, model, callback) {
  var limit = parseInt(req.query.limit) || 5;
  model.find(getQuery(req))
    .limit(limit)
    .sort('-updated_at')
    .select('title slug tags updated_at filename')
    .exec(callback);
};

exports.show = function (req, res, model, callback) {
  var query = getQuery(req);
  query.slug = req.params['slug'];
  model.findOne(query, callback);
};

exports.edit = function (req, res, model, callback) {
  if (checkAuth(req, res, 'writer'))
    return;

  model.findOne({slug: req.params['slug']}, callback);
};

exports.create = function (req, res, model, callback) {
  if (checkAuth(req, res, 'writer'))
    return;

  buildFile(req, model).save(callback);
};

exports.update = function (req, res, model, callback) {
  if (checkAuth(req, res, 'writer', req.path))
    return;

  model.findOne({slug: req.params['slug']}, function (error, file) {
    if (error) return callback(error);
    if (!file) return callback('File not found');

    var oldFilename = file.filename;

    file = buildFile(req, file);

    file.save(function (error, file) {
      if (checkSaveError(error, req, res))
        return;

      fs.unlink('./public/uploads' + oldFilename, function (error) {
        callback(error, file);
      });
    });
  });
};

function buildFile(req, model, file) {
  file = file || new model();

  file.title = req.body['title'] || file.title;
  file.tags = getTags(req.body) || file.tags;
  file.type = req.files.file.type || file.type;
  file.filename = req.files.file.path.substring(req.files.file.path.lastIndexOf('/')) || file.filename;

  return file;
}