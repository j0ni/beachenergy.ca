"use strict";

/* global require, console, exports */

var User = require('../datamodel/user')
  , shared = require('./shared')
  , checkAuth = shared.checkAuth
  , checkError = shared.checkError
  , checkSaveError = shared.checkSaveError
  , Article = require('../datamodel/article')
  , markdown = require('../lib/markdown')
  , Image = require('../datamodel/image')
  , Link = require('../datamodel/link')
  , fs = require('fs')
  , util = require('util')
  , ObjectId = require('mongoose').Types.ObjectId;

exports.users = {
  index: function (req, res) {
    if (checkAuth(req, res, 'admin'))
      return;

    User.find().sort('email').exec(function (error, users) {
      if (checkError(error, res))
        return;

      res.render('admin/users', { users: users, roles: User.Roles });
      return;
    });
  },

  setRole: function (req, res) {
    if (checkAuth(req, res, 'admin', '/admin/users'))
      return;

    User.findByEmail(req.params['email'], function (error, user) {
      if (checkError(error, res))
        return;

      if (!user) {
        res.send(404, 'User ' + req.params['email'] + ' not found');
        return;
      }

      user.role = req.body['role'];
      user.save(function (error, user) {
        if (checkSaveError(error, req, res, '/admin/users'))
          return;

        res.send(200, 'Role set to ' + user.role + ' for ' + req.params['email']);
        return;
      });
    });
  },

  delete: function (req, res) {
    if (checkAuth(req, res, 'admin', '/admin/users'))
      return;

    User.remove({email: req.params['email']}, function (error) {
      if (checkError(error, res))
        return;

      res.send(200, 'Deleted user ' + req.params['email']);
      return;
    });
  }
};

exports.articles = {
  index: function (req, res) {
    if (checkAuth(req, res, 'admin', '/admin/articles'))
      return;

    Article.find().sort('-updated_at').exec(function (error, articles) {
      if (checkError(error, res))
        return;

      res.render('admin/articles', { articles: articles, markdown: markdown });
      return;
    });
  },

  setVisible: function (req, res) {
    setVisible(req, res, '/admin/articles', Article, 'Article');
  },

  delete: function (req, res) {
    if (checkAuth(req, res, 'admin', '/admin/articles'))
      return;

    Article.remove({slug: req.params['slug']}, function (error) {
      if (checkError(error, res))
        return;


      res.send(200, 'Article deleted: "' + req.params['slug'] + '"');
      return;
    });
  }
};

exports.links = {
  index: function (req, res) {
    if (checkAuth(req, res, 'admin', '/admin/links'))
      return;

    Link.find().sort('-updated_at').exec(function (error, links) {
      if (checkError(error, res))
        return;

      res.render('admin/links', { links: links });
      return;
    });
  },

  setVisible: function (req, res) {
    if (checkAuth(req, res, 'admin', 'admin/links'))
      return;

    Link.findOne({_id: ObjectId.fromString(req.params['id'])}, function (error, link) {
      if (checkError(error, res))
        return true;

      if (!link) {
        res.send(404, 'Link not found');
        return;
      }

      link.visible = (req.body['visible'] === 'true');
      link.save(function (error, object) {
        if (checkSaveError(error, req, res, '/admin/links'))
          return;

        res.send(200, 'Link "' + link.url + '" is now ' + (link.visible ? 'visible to all' : 'invisible'));
        return;
      });
    });
  },

  delete: function (req, res) {
    if (checkAuth(req, res, 'admin', '/admin/links'))
      return;

    Link.remove({_id: ObjectId.fromString(req.params['id'])}, function (error) {
      if (checkError(error, res))
        return;

      res.send(200, 'Link deleted');
      return;
    });
  }
};

exports.images = {
  index: function (req, res) {
    if (checkAuth(req, res, 'admin', '/admin/images'))
      return;

    Image.find().sort('-updated_at').exec(function (error, images) {
      if (checkError(error, res))
        return;

      res.render('admin/images', { images: images });
      return;
    });
  },

  setVisible: function (req, res) {
    setVisible(req, res, '/admin/images', Image, 'Image');
  },

  delete: function (req, res) {
    if (checkAuth(req, res, 'admin', req.path))
      return;

    Image.findOne({slug: req.params['slug']}, function (error, image) {
      if (checkError(error, res))
        return;

      if (!image) {
        req.send(404, 'Image not found');
        return;
      }

      var filename = image.filename;

      image.remove(function (error) {
        if (checkError(error, res))
          return;

        fs.unlink('./public/uploads' + filename, function (error) {
          if (error) {
            console.error('could not delete image file: ' + filename);
            console.error(util.inspect(error));
            res.send(500, 'Image removed from site but file could not be deleted');
            return;
          }

          res.send(200, 'Image successfully deleted');
          return;
        });
      });
    });
  }
};

function setVisible(req, res, path, model, name) {
  if (checkAuth(req, res, 'admin', path))
    return;

  model.findOne({slug: req.params['slug']}, function (error, object) {
    if (checkError(error, res))
      return true;

    if (!object) {
      res.send(404, name + ' not found');
      return;
    }

    object.visible = (req.body['visible'] === 'true');
    object.save(function (error, object) {
      if (checkSaveError(error, req, res, path))
        return;

      res.send(200, name + ' "' + object.title + '" is now ' + (object.visible ? 'visible to all' : 'invisible'));
      return;
    });
  });
};
