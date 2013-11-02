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

  function loadDocs(Model, callback) {
    mongodb.cleanupCollection(Model, function (error) {
      if (error) return callback(error);

      async.forEach(dataFor(Model), function (row, cb) {
        (new Model(row)).save(function (error, instance) {
          if (error) return cb(error);
          addToCache(Model, instance);
          return cb();
        });
      }, callback);
    });
  };

  function dataFor(Model) {
    return require('./' + Model.modelName.toLowerCase() + 's');
  }

  function cachedDataFor(Model) {
    return cache[Model.modelName];
  }

  function addToCache(Model, doc) {
    if (!cache[Model.modelName]) cache[Model.modelName] = [];
    cache[Model.modelName].push(doc);
  }
};

exports.connect = mongodb.connect;
exports.disconnect = mongodb.disconnect;
