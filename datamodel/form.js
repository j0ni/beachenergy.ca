"use strict";

/* global require, module, exports */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FormSchema = exports = module.exports = new Schema({
  form: {type: String, required: true},
  user: {type: String},
  content: {},
  created_at: {type: Date},
  updated_at: {type: Date}
});

FormSchema.index({form: 1});
FormSchema.index({user: 1});

FormSchema.pre('save', function (next) {
  var now = new Date();
  if (!this.created_at) {
    this.created_at = now;
  }
  this.updated_at = now;
  next();
});
