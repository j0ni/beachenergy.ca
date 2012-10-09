"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = (function () {
  var ImageSchema = new Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true, lowercase: true, trim: true},
    tags: [String],
    type: {type: String, required: true},
    filename: {type: String, required: true},
    created_at: {type: Date},
    updated_at: {type: Date},
    visible: {type: Boolean, default: false}
  });

  ImageSchema.index({title: 1});
  ImageSchema.index({updated_at: 1});
  ImageSchema.index({slug: 1}, {unique: true});

  ImageSchema.pre('save', function (next) {
    var now = new Date();
    if (!this.created_at) {
      this.created_at = now;
    }
    this.updated_at = now;
    next();
  });

  ImageSchema.plugin(require('./sluggenerator')());

  return mongoose.model('Image', ImageSchema);
}());