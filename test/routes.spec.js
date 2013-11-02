"use strict";

var makeApp = require('../app'),
    mongoose = require('mongoose'),
    should = require('should'),
    request = require('supertest'),
    mongo = require('./fixtures'),
    util = require('util'),
    loginFactory = require('./util/login-user');

describe('routing', function () {
  var app,
      fixtures,
      login,
      connection;

  beforeEach(function (done) {
    mongo.connect(function (error, _connection) {
      connection = _connection;
      app = makeApp(connection);
      fixtures = mongo.makeFixtures(connection.models);
      login = loginFactory(app);

      fixtures.loadAll(function (error) {
        should.not.exist(error);
        done();
      });
    });
  });

  afterEach(function (done) {
    fixtures.unloadAll(function (error) {
      should.not.exist(error);
      console.log('connection is ' + util.inspect(connection));
      mongo.disconnect(function (error) {
        should.not.exist(error);
        console.log('connection is now ' + util.inspect(connection));
        done();
      });
    });
  });

  describe('GET /', function () {
    it('succeeds', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });

  describe('articles', function () {
    describe('GET /articles', function () {
      it('succeeds', function (done) {
        request(app)
          .get('/articles')
          .expect(200, done);
      });
    });

    describe('GET /articles/new', function () {
      describe('without authorization', function () {
        it('redirects to /', function (done) {
          request(app)
            .get('/articles/new')
            .expect(302)
            .expect('Location', '/', done);
        });
      });
    });
  });

  describe('images', function () {
    describe('GET /images', function () {
      it('succeeds', function (done) {
        request(app)
          .get('/images')
          .expect(200, done);
      });
    });

    describe('GET /images/new', function () {
      describe('without authorization', function () {
        it('redirects to /', function (done) {
          request(app)
            .get('/images/new')
            .expect(302)
            .expect('Location', '/', done);
        });
      });
    });
  });

  describe('documents', function () {
    describe('GET /docs', function () {
      it('succeeds', function (done) {
        request(app)
          .get('/docs')
          .expect(200, done);
      });
    });

    describe('GET /docs/new', function () {
      describe('without authorization', function () {
        it('redirects to /', function (done) {
          request(app)
            .get('/docs/new')
            .expect(302)
            .expect('Location', '/', done);
        });
      });
    });
  });

  describe('links', function () {
    describe('GET /links', function () {
      it('yields a 404', function (done) {
        request(app)
          .get('/links')
          .expect(404, done);
      });
    });

    describe('GET /links/new', function () {
      describe('without authorization', function () {
        it('redirects to /', function (done) {
          request(app)
            .get('/links/new')
            .expect(302)
            .expect('Location', '/', done);
        });
      });
    });
  });

  describe('users', function () {
    describe('GET /users', function () {
      it('yields a 404', function (done) {
        request(app)
          .get('/users')
          .expect(404, done);
      });
    });

    describe('authentication', function () {
      describe('GET /users/login', function () {
        it('succeeds', function (done) {
          request(app)
            .get('/users/login')
            .expect(200, done);
        });
      });

      describe('POST /users/login', function () {
        it('redirects to /', function (done) {
          request(app)
            .post('/users/login')
            .type('form')
            .send({ username: 'simon@spoon.com' })
            .send({ password: 'dog' })
            .expect(302)
            .expect('Location', '/', done);
        });

        it('shows a logged in email address after redirect to GET /', function (done) {
          login('simon@spoon.com', 'dog', function (error, server, cookies) {
            should.not.exist(error);

            // request(app)
            server
              .get('/')
              .set('Cookie', cookies)
              .end(function (error, res) {
                res.text.should.include('simon');
                done();
              });
          });
        });
      });

      describe('GET /users/logout', function () {
        it('redirects to /', function (done) {
          request(app)
            .get('/users/logout')
            .expect(302, done);
        });
      });
    });

    describe('signup', function () {
      describe('GET /users/new', function () {
        it('succeeds', function (done) {
          request(app)
            .get('/users/new')
            .expect(200, done);
        });
      });
    });
  });

  describe('admin', function () {
    describe('users', function () {
      describe('without authorization', function () {
        describe('GET /admin/users', function () {
          it('redirects to /', function (done) {
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
          it('redirects to /', function (done) {
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
          it('redirects to /', function (done) {
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
          it('redirects to /', function (done) {
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
          it('redirects to /', function (done) {
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
