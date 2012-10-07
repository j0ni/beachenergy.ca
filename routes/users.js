"use strict";

/* global require, exports, console */

var User = require('../datamodel/user');
var util = require('util');

exports.new = function (req, res) {
  sendForm(new User(), res);
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

    req.flash('info', 'Success');
    res.redirect('/');
  });
}

exports.login = function (req, res) {
  res.render('users/login');
};

exports.edit = function (req, res) {
  res.render('users/form');
};


function sendForm(user, res) {
  res.render('users/form');
}

function checkError(error, res) {
  if (error) {
    console.error(error);
    res.send(500, {error: error});
    return true;
  }
}

function checkSaveError(error, req, res) {
  if (error && error['name'] && error['name'] === 'ValidationError') {
    req.flash('error', error);
    res.redirect('/');
    return true;
  }

  return checkError(error, res);
}

function buildUser(params, user) {
  user = user || new User();

  user.firstname = params['firstname'] || user.firstname;
  user.lastname = params['lastname'] || user.lastname;
  user.email = params['email'] || user.email;

  return user;
}
