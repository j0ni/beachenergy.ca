"use strict";

/* global module, require, exports */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    slugmaker = require('./sluggenerator');

var ArticleSchema = exports = module.exports = new Schema({
  title: {type: String, required: true},
  slug: {type: String, required: true, lowercase: true, trim: true},
  author: {type: String, required: true},
  content: {type: String, required: false},
  tags: [String],
  created_at: {type: Date},
  updated_at: {type: Date},
  visible: {type: Boolean, default: false}
});

ArticleSchema.index({author: 1});
ArticleSchema.index({title: 1});
ArticleSchema.index({slug: 1}, {unique: true});
ArticleSchema.index({updated_at: 1});

ArticleSchema.pre('save', function (next) {
  var now = new Date();
  if (!this.created_at) {
    this.created_at = now;
  }
  this.updated_at = now;
  next();
});

ArticleSchema.plugin(slugmaker());
