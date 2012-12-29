"use strict";

/* global require, describe, it, before, beforeEach, after, afterEach */

var makeApp = require('../app'),
    mongoose = require('mongoose'),
    assert = require('should'),
    request = require('supertest');

describe('routing', function () {
  var connection;
  var app;

  beforeEach(function (done) {
    connection = mongoose.createConnection('mongodb://127.0.0.1/beachenergy-test');
    connection.once('open', function () {
      app = makeApp(connection);
      done();
    });
  });

  afterEach(function (done) {
    connection.close(function (error) {
      assert(error === undefined);
      done();
    });
  });

  describe('GET /', function () {
    it('should succeed', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });

  describe('articles', function () {
    describe('GET /articles', function () {
      it('should succeed', function (done) {
        request(app)
          .get('/articles')
          .expect(200, done);
      });
    });
  });

  describe('images', function () {
    describe('GET /images', function () {
      it('should succeed', function (done) {
        request(app)
          .get('/images')
          .expect(200, done);
      });
    });
  });

  describe('documents', function () {
    describe('GET /docs', function () {
      it('should succeed', function (done) {
        request(app)
          .get('/docs')
          .expect(200, done);
      });
    });
  });

  describe('links', function () {
    describe('GET /links', function () {
      it('should yield a 404', function (done) {
        request(app)
          .get('/links')
          .expect(404, done);
      });
    });
  });

  describe('users', function () {
    describe('GET /users', function () {
      it('should yield a 404', function (done) {
        request(app)
          .get('/users')
          .expect(404, done);
      });
    });

    describe('GET /users/login', function () {
      it('should succeed', function (done) {
        request(app)
          .get('/users/login')
          .expect(200, done);
      });
    });

    describe('GET /users/new', function () {
      it('should succeed', function (done) {
        request(app)
          .get('/users/new')
          .expect(200, done);
      });
    });

    describe('GET /users/logout', function () {
      it('should redirect to /', function (done) {
        request(app)
          .get('/users/logout')
          .expect(302, done);
      });
    });
  });

  describe('admin', function () {
    describe('users', function () {
      describe('without authorization', function () {
        describe('GET /admin/users', function () {
          it('should redirect to /', function (done) {
            request(app)
              .get('/admin/users')
              .expect(302)
              .expect('Location', '/', done);
          });
        });
      });
    });

    describe('articles', function () {
      describe('without authorization', function () {
        describe('GET /admin/articles', function () {
          it('should redirect to /', function (done) {
            request(app)
              .get('/admin/articles')
              .expect(302)
              .expect('Location', '/', done);
          });
        });
      });
    });

    describe('links', function () {
      describe('without authorization', function () {
        describe('GET /admin/links', function () {
          it('should redirect to /', function (done) {
            request(app)
              .get('/admin/links')
              .expect(302)
              .expect('Location', '/', done);
          });
        });
      });
    });

    describe('images', function () {
      describe('without authorization', function () {
        describe('GET /admin/images', function () {
          it('should redirect to /', function (done) {
            request(app)
              .get('/admin/images')
              .expect(302)
              .expect('Location', '/', done);
          });
        });
      });
    });

    describe('docs', function () {
      describe('without authorization', function () {
        describe('GET /admin/docs', function () {
          it('should redirect to /', function (done) {
            request(app)
              .get('/admin/docs')
              .expect(302)
              .expect('Location', '/', done);
          });
        });
      });
    });
  });
});