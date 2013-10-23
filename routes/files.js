"use strict";

var shared = require('./shared'),
    getQuery = shared.getQuery,
    checkError = shared.checkError,
    checkAuth = shared.checkAuth,
    getTags = shared.getTags,
    checkSaveError = shared.checkSaveError,
    fs = require('fs');

exports.index = function (req, res, Model, callback) {
  var limit = parseInt(req.query.limit) || 5;
  Model.find(getQuery(req))
    .limit(limit)
    .sort('-updated_at')
    .select('title slug tags updated_at filename')
    .exec(callback);
};

exports.show = function (req, res, Model, callback) {
  var query = getQuery(req);
  query.slug = req.params.slug;
  Model.findOne(query, callback);
};

exports.new = function (req, res, Model) {
  if (checkAuth(req, res, 'writer'))
    return;

  sendForm(new Model(), res);
};

exports.edit = function (req, res, Model) {
  if (checkAuth(req, res, 'writer'))
    return;

  Model.findOne({slug: req.params.slug}, function (error, file) {
    if (checkError(error, req, res))
      return;

    if (!file) {
      req.flash('error', 'File not found');
      res.redirect('/');
      return;
    }

    sendForm(file, res);
  });
};

exports.create = function (req, res, Model, callback) {
  if (checkAuth(req, res, 'writer'))
    return;

  buildFile(req, Model).save(callback);
};

exports.update = function (req, res, Model, callback) {
  if (checkAuth(req, res, 'writer', req.path))
    return;

  Model.findOne({slug: req.params.slug}, function (error, file) {
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

function sendForm(file, res) {
  res.render('files/form', { file: file });
}

function buildFile(req, Model, file) {
  file = file || new Model();

  file.title = req.body.title || file.title;
  file.tags = getTags(req.body) || file.tags;
  file.type = req.files.file.type || file.type;
  file.filename = req.files.file.path.substring(req.files.file.path.lastIndexOf('/')) || file.filename;

  return file;
}
