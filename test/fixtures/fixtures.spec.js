var mongodb = require('./'),
    makeFixtures = mongodb.makeFixtures,
    makeModels = require('../../datamodel'),
    assert = require('should'),
    async = require('async');

describe('fixtures', function () {
  var fixtures,
      models;

  beforeEach(function (done) {
    mongodb.connect(function (error, connection) {
      models = makeModels(connection);
      fixtures = makeFixtures(models);
      done();
    });
  });

  afterEach(function (done) {
    mongodb.disconnect(done);
  });

  describe('loading', function () {
    describe('a single collection', function () {
      it('loads the right number of documents', function (done) {
        async.each(Object.keys(models), function (key, cb) {
          var model = models[key],
              data = require('./' + model.modelName.toLowerCase() + 's');

          fixtures.load(model, function (error) {
            assert(!error);

            model.count(function (error, count) {
              assert(!error);
              count.should.equal(data.length);

              cb();
            });
          });
        }, done);
      });
    });
  });
});
