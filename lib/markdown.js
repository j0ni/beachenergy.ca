"use strict";

/* global require, module */

var marked = require('marked');

module.exports = function (str, limit) {
  if (limit && str.length > limit) {
    while (limit < str.length && str[limit].match(/\w/))
      limit++;

    str = str.substr(0, limit) + '...';
  }

  return marked(str);
};
