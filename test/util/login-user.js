var _ = require('underscore'),
    request = require('supertest');

module.exports = function (app) {
  return _.partial(loginUser, app);
};

function loginUser(app, email, password, callback) {
  var server = request.agent(app);
  server
    .post('/users/login')
    .type('form')
    .send({ username: email, password: password })
    .end(function (error, res) {
      if (error) return callback(error);
      var cookies = res.headers['set-cookie'].pop().split(';')[0];
      return callback(null, server, cookies);
    });
};
