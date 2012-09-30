"use strict";

var Image = require('../datamodel/image');
var util = require('util');
var fs = require('fs');

exports.index = function (req, res) {
  var limit = parseInt(req.query.limit) || 3;
  Image.find({visible: true})
    .limit(limit)
    .sort('-updated_at')
    .select('title slug tags updated_at')
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
  Image.create(buildImage(req), function (error, image) {
    if (checkError(error, res))
      return;

    res.redirect('/images');
  });
};

exports.update = function (req, res) {
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

function sendForm(image, res) {
  res.render('images/form', { image: image });
}

function checkError(error, res) {
  if (error) {
    console.error(error);
    res.send(500, { error: error });
    return true;
  }
}