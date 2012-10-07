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

    saveUser(user, res);
  });
};

exports.update = function (req, res) {
  User.findOne({email: req.user.email}, function (error, user) {
    if (checkError(error, res))
      return;

    if (!user) {
      res.send(404, {error: 'not found'});
      return;
    }

    user = buildUser(req.body, user);

    if (req.body['password']) {
      user.changePassword(req.body['password'], req.body['confirm'], function (error, user) {
        if (error) {
          req.flash('error', error);
          res.redirect('/');
          return;
        }

        saveUser(user, res);
      });
    } else {
      saveUser(user, res);
    }
  });
};

function saveUser(user, res) {
  user.save(function (error, user) {
    if (checkSaveError(error, res))
      return;

    res.redirect('/');
  });
}

exports.login = function (req, res) {
  console.log(util.inspect(req));
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

function checkSaveError(error, res) {
  if (error && error['name'] && error['name'] === 'ValidationError') {
    res.send(400, {error: error});
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
