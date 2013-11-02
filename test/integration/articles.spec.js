"use strict";

var makeApp = require('../../app'),
    should = require('should'),
    request = require('supertest'),
    mongodb = require('../fixtures'),
    loginFactory = require('../util/login-user');

describe('/articles', function () {
  var app,
      fixtures,
      login;

  beforeEach(function (done) {
    mongodb.connect(function (error, connection) {
      app = makeApp(connection);
      fixtures = mongodb.makeFixtures(connection.models);
      login = loginFactory(app);
      done();
    });
  });

  afterEach(function (done) {
    fixtures.unloadAll(function (error) {
      should.not.exist(error);
      mongodb.disconnect(done);
    });
  });

  describe('GET /articles', function () {
    it('returns a 200', function (done) {
      request(app)
        .get('/articles')
        .expect(200, done);
    });
  });

  describe('POST /articles', function () {
  });

  describe('GET /articles/new', function () {
  });

  describe('GET /articles/:article', function () {
  });

  describe('POST /article/:article', function () {

  });

  describe('GET /article/:article/edit', function () {

  });

});
