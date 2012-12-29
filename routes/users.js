"use strict";

/* global require, exports, console, module */

var util = require('util'),
    shared = require('./shared'),
    checkError = shared.checkError,
    checkSaveError = shared.checkSaveError;

exports = module.exports = function (User) {
  var routes = {};

  routes.new = function (req, res) {
    res.render('users/form', { user: new User() });
  };

  routes.create = function (req, res) {
    var user = buildUser(req.body);

    user.changePassword(req.body['password'], req.body['confirm'], function (error, user) {
      if (error) {
        req.flash('error', error);
        res.redirect('/');
        return;
      }

      saveUser(user, req, res);
    });
  };

  routes.update = function (req, res) {
    User.findByEmail(req.user.email, function (error, user) {
      if (checkError(error, req, res))
        return;

      if (!user) {
        res.send(404, {error: 'not found'});
        return;
      }

      user = buildUser(req.body, user);

      if (req.body['password'] && req.body['password'].trim()) {
        user.changePassword(req.body['password'], req.body['confirm'], function (error, user) {
          if (error) {
            req.flash('error', error);
            res.redirect('/');
            return;
          }

          saveUser(user, req, res);
        });
      } else {
        saveUser(user, req, res);
      }
    });
  };

  function saveUser(user, req, res) {
    user.save(function (error, user) {
      if (checkSaveError(error, req, res))
        return;

      var message = user.canActAs('writer') ? 'Success' : 'Success. If you want to write articles, contact an adminitrator.';
      req.flash('success', message);
      res.redirect('/');
    });
  }

  routes.login = function (req, res) {
    res.render('users/login');
  };

  routes.edit = function (req, res) {
    res.render('users/form', { user: req.user });
  };

  function buildUser(params, user) {
    user = user || new User();

    user.firstname = params['firstname'] || user.firstname;
    user.lastname = params['lastname'] || user.lastname;
    user.email = params['email'] || user.email;

    return user;
  }

  return routes;
};
