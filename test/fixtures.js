var makeModels = require('../datamodel'),
    async = require('async');

module.exports = function (connection) {
  "use strict";

  var fixtures = {};
  var models = makeModels(connection);

  fixtures.load = function (callback) {
    process.nextTick(function () {
      deleteDocs(models.User, function (error) {
        if (error) return callback(error);
        async.forEach([{
          firstname: 'Simon',
          lastname: 'Spoon',
          email: 'simon@spoon.com',
          password: 'dog',
          role: 'consumer'
        },{
          firstname: 'Boss',
          lastname: 'Geezer',
          email: 'boss@geezer.com',
          password: 'cat',
          role: 'admin'
        },{
          firstname: 'Author',
          lastname: 'Author',
          email: 'author@author.com',
          password: 'lobster',
          role: 'writer'
        }], function (hash, cb) {
          (new models.User(hash)).save(function (error, user) {
            if (error) return cb(error);
            return cb();
          });
        }, callback);
      });
    });
  };

  fixtures.unload = function (callback) {
    process.nextTick(function () {
      deleteDocs(models.User, callback);
    });
  };

  function deleteDocs(model, callback) {
    process.nextTick(function () {
      model.find().exec(function (error, docs) {
        if (error) return callback(error);
        async.forEach(docs, function (doc, cb) {
          doc.remove(cb);
        }, callback);
      });
    });
  }

  return fixtures;
};
