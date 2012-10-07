"use strict";

/* global require, exports, console */

var User = require('../datamodel/user');
var util = require('util');
var shared = require('./shared');
var checkError = shared.checkError;
var checkSaveError = shared.checkSaveError;

exports.new = function (req, res) {
  res.render('users/form');
};

exports.create = function (req, res) {
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

exports.update = function (req, res) {
  User.findByEmail(req.user.email, function (error, user) {
    if (checkError(error, res))
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

    var message = user.admin ? 'Success' : 'Success. If you want to edit articles, contact an adminitrator.';
    req.flash('success', message);
    res.redirect('/');
  });
}

exports.login = function (req, res) {
  res.render('users/login');
};

exports.edit = function (req, res) {
  res.render('users/form');
};


function buildUser(params, user) {
  user = user || new User();

  user.firstname = params['firstname'] || user.firstname;
  user.lastname = params['lastname'] || user.lastname;
  user.email = params['email'] || user.email;

  return user;
}
