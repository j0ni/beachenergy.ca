var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),

    connection;


exports.connect = function connect(callback) {
  connection = mongoose.createConnection('mongodb://127.0.0.1/beachenergy-test');

  connection.once('open', function () {
    return callback(null, connection);
  });
};

exports.disconnect = function disconnect(callback) {
  if (!connection) {
    return callback('call connect first');
  }

  connection.close(function (error) {
    if (error) return callback(error);

    return callback();
  });
};

exports.cleanup = function cleanup(models, callback) {
  if (!connection) {
    return callback('call connect first');
  }

  async.forEach(Object.keys(models), _.partial(_cleanupCollection, models), callback);
};

exports.cleanupCollection = cleanupCollection;
function cleanupCollection(model, callback) {
  model.find().exec(function (error, docs) {
    if (error) return callback(error);

    async.forEach(docs, function (doc, cb) {
      doc.remove(cb);
    }, callback);
  });
};

function _cleanupCollection(models, modelName, callback) {
  return cleanupCollection(models[modelName], callback);
}
