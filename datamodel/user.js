"use strict";

/* global require, module, console */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

module.exports = (function () {
  var UserSchema = new Schema({
    firstname: {type: String, required: false, trim: true},
    lastname: {type: String, required: false, trim: true},
    email: {type: String, required: true, index: { unique: true }},
    password: {type: String, required: true},
    role: {type: String, default: 'consumer', trim: true},
    created_at: {type: Date},
    updated_at: {type: Date, index: 1}
  });

  // timestamps
  UserSchema.pre('save', function (next) {
    var now = new Date();
    if (!this.created_at) {
      this.created_at = now;
    }
    this.updated_at = now;
    next();
  });

  UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified()) return next();
    if (user.originalPassword === user.password) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (error, salt) {
      if (error) return next(error);

      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) return next(error);

        user.password = hash;
        next();
      });
    });
  });

  UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  };

  UserSchema.methods.changePassword = function (password, confirm, callback) {
    if (password && confirm) {
      if (password === confirm) {
        this.password = password;
        callback(undefined, this);
      } else {
        callback('Passwords did not match');
      }
    } else {
      callback('Password cannot be empty');
    }
  }

  var Roles = UserSchema.statics.Roles = ['admin', 'writer', 'consumer'];

  UserSchema.methods.canActAs = function (role) {
    var required = Roles.indexOf(role);
    var actual = Roles.indexOf(this.role);
    if (actual <= required) return true;
  }

  UserSchema.statics.findByEmail = function (email, callback) {
    this.findOne({email: email}, function (error, user) {
      if (error) return callback(error);
      if (!user) return callback();

      user.originalPassword = user.password;
      callback(undefined, user);
    });
  };


  return mongoose.model('User', UserSchema);
}());