"use strict";

/* global module */

/* taken from mongoose exmple */

module.exports = function (options) {
  options = options || {};
  var key = options.key || 'title';

  return function slugGenerator(schema) {
    schema.path(key).set(function (v) {
      this.slug = v.toLowerCase().replace(/ +/g, '-').replace(/[^a-z0-9-]/g, '');
      return v;
    });
  };
};