"use strict";

/* global require, module */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = (function () {
  var DocSchema = new Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true, lowecase: true, trim: true},
    tags: [String],
    type: {type: String, required: true},
    filename: {type: String, required: true},
    created_at: {type: Date},
    updated_at: {type: Date},
    visible: {type: Boolean, default: false}
  });

  DocSchema.index({title: 1});
  DocSchema.index({updated_at: 1});
  DocSchema.index({slug: 1}, {unique: true});

  DocSchema.pre('save', function (next) {
    var now = new Date();
    if (!this.created_at) {
      this.created_at = now;
    }
    this.updated_at = now;
    next();
  });

  DocSchema.plugin(require('./sluggenerator')());

  return mongoose.model('Doc', DocSchema);
}());