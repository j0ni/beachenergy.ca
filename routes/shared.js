"use strict";

/* global require, console, exports */

exports.checkAuth = function (req, res, role) {
  role = role || 'admin';

  if (!(req.user && req.user.role === role)) {
    req.flash('error', 'Not authorized');
    res.redirect('/');
    return true;
  }
};

exports.checkError = checkError;
function checkError(error, res) {
  if (error) {
    console.error(error);
    res.send(500, {error: error});
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

  return checkError(error, res);
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