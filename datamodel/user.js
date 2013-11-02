"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var UserSchema = module.exports = new Schema({
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
};

var Roles = UserSchema.statics.Roles = ['admin', 'writer', 'consumer'];

UserSchema.methods.canActAs = function (role) {
  var required = Roles.indexOf(role);
  var actual = Roles.indexOf(this.role);
  if (actual <= required) return true;
};

var util = require('util');

UserSchema.statics.findByEmail = function (email, callback) {
  console.log('in findByEmail');
  console.log('this is ' + util.inspect(this));
  this.findOne({email: email}, function (error, user) {
    if (error) return callback(error);
    if (!user) return callback();

    console.log('got the user: ' + util.inspect(user));

    user.originalPassword = user.password;
    callback(undefined, user);
  });
};
