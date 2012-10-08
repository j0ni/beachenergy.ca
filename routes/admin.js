"use strict";

/* global require, console, exports */

var User = require('../datamodel/user')
  , shared = require('./shared')
  , checkAuth = shared.checkAuth
  , checkError = shared.checkError
  , checkSaveError = shared.checkSaveError;

exports.users = function (req, res) {
  if (checkAuth(req, res, 'admin'))
    return;

  User.find().sort('email').exec(function (error, users) {
    if (checkError(error, res))
      return;

    res.render('admin/users', { users: users, roles: User.Roles });
  });
};

exports.setRole = function (req, res) {
  if (checkAuth(req, res, 'admin', '/admin/users'))
    return;

  User.findOne({email:req.params['email']}, function (error, user) {
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
};

exports.deleteUser = function (req, res) {
  if (checkAuth(req, res, 'admin', '/admin/users'))
    return;

  User.remove({email: req.params['email']}, function (error) {
    if (checkError(error, res))
      return;

    res.send(200, 'Deleted user ' + req.params['email']);
    return;
  });
};