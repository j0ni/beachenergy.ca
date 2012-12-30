"use strict";

/* global require, console, exports, module */

var shared = require('./shared'),
    checkAuth = shared.checkAuth,
    checkError = shared.checkError,
    checkSaveError = shared.checkSaveError,
    markdown = require('../lib/markdown'),
    fs = require('fs'),
    util = require('util'),
    ObjectId = require('mongoose').Types.ObjectId;

exports = module.exports = function (models) {
  var routes = {};

  routes.users = {
    index: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.User.find().sort('email').exec(function (error, users) {
        if (checkError(error, req, res))
          return;

        res.render('admin/users', { users: users, roles: models.User.Roles });
        return;
      });
    },

    setRole: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.User.findByEmail(req.params['email'], function (error, user) {
        if (checkError(error, req, res))
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
      if (checkAuth(req, res, 'admin'))
        return;

      models.User.remove({email: req.params['email']}, function (error) {
        if (checkError(error, req, res))
          return;

        res.send(200, 'Deleted user ' + req.params['email']);
        return;
      });
    }
  };

  routes.articles = {
    index: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.Article.find().sort('-updated_at').exec(function (error, articles) {
        if (checkError(error, req, res))
          return;

        res.render('admin/articles', { articles: articles, markdown: markdown });
        return;
      });
    },

    setVisible: function (req, res) {
      setVisible(req, res, '/admin/articles', models.Article, 'Article');
    },

    delete: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.Article.remove({slug: req.params['slug']}, function (error) {
        if (checkError(error, req, res))
          return;


        res.send(200, 'Article deleted: "' + req.params['slug'] + '"');
        return;
      });
    }
  };

  routes.links = {
    index: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.Link.find().sort('-updated_at').exec(function (error, links) {
        if (checkError(error, req, res))
          return;

        res.render('admin/links', { links: links });
        return;
      });
    },

    setVisible: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.Link.findOne({ _id: ObjectId.fromString(req.params['id']) }, function (error, link) {
        if (checkError(error, req, res))
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
      if (checkAuth(req, res, 'admin'))
        return;

      models.Link.remove({ _id: ObjectId.fromString(req.params['id']) }, function (error) {
        if (checkError(error, req, res))
          return;

        res.send(200, 'Link deleted');
        return;
      });
    }
  };

  routes.forms = {
    index: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.Form.find().sort('-updated_at').exec(function (error, forms) {
        if (checkError(error, req, res))
          return;

        res.render('admin/forms', { forms: forms });
        return;
      });
    },

    show: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.Form.findOne({ _id: ObjectId.fromString(req.params['id']) }, function (error, form) {
        if (checkError(error, req, res))
          return;

        res.render('admin/form', { form: form });
        return;
      });
    },

    delete: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.Form.remove({ _id: ObjectId.fromString(req.params['id']) }, function (error) {
        if (checkError(error, req, res))
          return;

        res.send(200, 'Form submission deleted');
        return;
      });
    }
  };

  routes.images = {
    index: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.Image.find().sort('-updated_at').exec(function (error, images) {
        if (checkError(error, req, res))
          return;

        res.render('admin/images', { images: images });
        return;
      });
    },

    setVisible: function (req, res) {
      setVisible(req, res, '/admin/images', models.Image, 'Image');
    },

    delete: function (req, res) {
      deleteFile(req, res, models.Image);
    }
  };

  routes.docs = {
    index: function (req, res) {
      if (checkAuth(req, res, 'admin'))
        return;

      models.Doc.find().sort('-updated_at').exec(function (error, docs) {
        if (checkError(error, req, res))
          return;

        res.render('admin/docs', { docs: docs });
        return;
      });
    },

    setVisible: function (req, res) {
      setVisible(req, res, '/admin/docs', models.Doc, 'Doc');
    },

    delete: function (req, res) {
      deleteFile(req, res, models.Doc);
    }
  };

  return routes;
};

function deleteFile(req, res, model) {
  if (checkAuth(req, res, 'admin'))
    return;

  model.findOne({slug: req.params['slug']}, function (error, file) {
    if (checkError(error, req, res))
      return;

    if (!file) {
      res.send(404, 'File not found');
      return;
    }

    var filename = file.filename;

    file.remove(function (error) {
      if (checkError(error, req, res))
        return;

      fs.unlink('./public/uploads' + filename, function (error) {
        if (error) {
          console.error('could not delete file: ' + filename);
          console.error(util.inspect(error));
          res.send(500, 'File removed from site but file could not be deleted');
          return;
        }

        res.send(200, 'File successfully deleted');
        return;
      });
    });
  });
}

function setVisible(req, res, path, model, name) {
  if (checkAuth(req, res, 'admin'))
    return;

  model.findOne({slug: req.params['slug']}, function (error, object) {
    if (checkError(error, req, res))
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
