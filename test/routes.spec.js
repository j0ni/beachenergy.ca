"use strict";

/* global require, describe, it, before, beforeEach, after, afterEach */

var makeApp = require('../app'),
    mongoose = require('mongoose'),
    assert = require('should'),
    request = require('supertest'),
    makeFixtures = require('./fixtures'),
    superagent = require('superagent');

describe('routing', function () {
  var connection;
  var app;
  var fixtures;

  before(function (done) {
    connection = mongoose.createConnection('mongodb://127.0.0.1/beachenergy-test');
    connection.once('open', function () {
      app = makeApp(connection);
      fixtures = makeFixtures(connection);
      done();
    });
  });

  beforeEach(function (done) {
    fixtures.load(function (error) {
      assert(error === null);
      done();
    });
  });


  afterEach(function (done) {
    fixtures.unload(function (error) {
      assert(error === null);
      done();
    });
  });

  after(function (done) {
    connection.close(function (error) {
      assert(error === undefined);
      done();
    });
  });

  function loginUser(email, password, callback) {
    request(app)
      .post('/users/login')
      .type('form')
      .send({ username: email, password: password })
      .end(function (error, res) {
        assert(error === null);
        var agent = superagent.agent();
        agent.saveCookies(res);
        return callback(agent);
      });
  }

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
          loginUser('simon@spoon.com', 'dog', function (agent) {
            var req = request(app).get('/');
            agent.attachCookies(req);
            req.end(function (error, res) {
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