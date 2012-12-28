"use strict";

var _ = require('underscore');

/* global require, console, exports */

exports.checkAuth = function (req, res, role, redirect) {
  role = role || 'admin';
  redirect = redirect || '/';

  if (!req.user.canActAs(role)) {
    req.flash('error', 'Not authorized');
    res.redirect(redirect);
    return true;
  }
};

exports.checkError = checkError;
function checkError(error, req, res, redirect) {
  redirect = redirect || '/';

  if (error) {
    console.error(error);
    req.flash('error', error);
    res.redirect(redirect);
    return true;
  }
};

exports.checkSaveError = function (error, req, res, redirect) {
  redirect = redirect || '/';

  if (error && error['name'] && error['name'] === 'ValidationError') {
    req.flash('error', formatValidationErrors(error));
    res.redirect(redirect);
    return true;
  }

  return checkError(error, req, res, redirect);
};

exports.getQuery = function (req) {
  if (req.user && req.user.canActAs('writer'))
    return {};
  else
    return { visible: true };
};

exports.getTags = function (params) {
  var tags = params['tags'] || '';
  tags = tags.split(/ +/);
  tags = _.select(tags, function (tag) { return tag.length > 0; });
  if (tags.length > 0)
    return tags;
};

function formatValidationErrors(error) {
  var result = '<p>Validation failed.</p><ul>';
  for (var key in error.errors) {
    if (error.errors.hasOwnProperty(key)) {
      result += '<li>' + key + ': ' + error.errors[key] + '</li>';
    }
  }
  result += '</ul>';
  return result;
}