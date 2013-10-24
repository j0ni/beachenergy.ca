var makeModels = require('../../datamodel'),
    async = require('async'),
    mongodb = require('./mongodb'),
    _ = require('underscore');

exports.makeFixtures = function (models) {
  var fixtures = {},
      cache = {};

  fixtures.loadAll = function (callback) {
    var modelArr = _.map(Object.keys(models), function (k) { return models[k]; });
    async.forEach(modelArr, loadDocs, callback);
  };

  fixtures.unloadAll = _.partial(mongodb.cleanup, models);
  fixtures.load = loadDocs;
  fixtures.unload = mongodb.cleanupCollection;
  fixtures.dataFor = dataFor;
  fixtures.cachedDataFor = cachedDataFor;

  return fixtures;

  function loadDocs(model, callback) {
    mongodb.cleanupCollection(model, function (error) {
      if (error) return callback(error);

      async.forEach(dataFor(model), function (row, cb) {
        new model(row).save(function (error, instance) {
          if (error) return cb(error);
          addToCache(model, instance);

          return cb();
        });
      }, callback);
    });
  };

  function dataFor(model) {
    return require('./' + model.modelName.toLowerCase() + 's');
  }

  function cachedDataFor(model) {
    return cache[model.modelName];
  }

  function addToCache(model, doc) {
    if (!cache[model.modelName]) cache[model.modelName] = [];
    cache[model.modelName].push(doc);
  }
};

exports.connect = mongodb.connect;
exports.disconnect = mongodb.disconnect;
