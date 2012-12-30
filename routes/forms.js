"use strict";

/* global require, exports, module, console, process */

var nodemailer = require('nodemailer'),
    config = require('../config'),
    Recaptcha = require('recaptcha').Recaptcha,
    util = require('util');

exports = module.exports = function (Form) {
  var routes = {};

  routes.show = function (req, res) {
    var formContent = {};
    if (req.user) {
      formContent.email = req.user.email;
      formContent.name = req.user.firstname + ' ' + req.user.lastname;
    }

    var recaptcha = new Recaptcha(config.recaptcha.publicKey, config.recaptcha.privateKey);

    res.render('forms/' + req.params['form'], {
      recaptcha_form: recaptcha.toHTML(),
      form_content: formContent
    });
  };

  routes.submit = function (req, res) {
    var recaptcha = new Recaptcha(config.recaptcha.publicKey, config.recaptcha.privateKey, {
      remoteip:  req.connection.remoteAddress,
      challenge: req.body.recaptcha_challenge_field,
      response:  req.body.recaptcha_response_field
    });

    recaptcha.verify(function (success, error_code) {
      if (success) {
        delete req.body.recaptcha_challenge_field;
        delete req.body.recaptcha_response_field;
        var user = '';
        if (req.user) user = req.user.email;

        (new Form({
          form: req.params['form'],
          user: user,
          content: req.body
        })).save(function (error, form) {
          if (handleError(error, req, res, recaptcha))
            return;

          process.nextTick(function () {
            var transport = nodemailer.createTransport(config.email.name, config.email.options);
            transport.sendMail({
              from: 'web@beachenergy.ca',
              to: config.email.recipient,
              subject: 'New signup form submitted',
              text: util.inspect(req.body),
              html: constructBody(req.body)
            }, function (error, response) {
              if (error)
                console.log(error);

              transport.close();
            });
          });

          req.flash('success', "Thank you! We'll be in touch.");
          res.redirect('/');

        });

        return;
      }

      handleError('Recaptcha error - please try again', req, res, recaptcha);
    });
  };

  function constructBody(content) {
    var body = '<html><body><dl>';
    Object.keys(content).forEach(function (key) {
      body += '<dt>' + key + '</dt>';
      body += '<dd>' + content[key] + '</dd>';
    });
    body += '</dl></body></html>';
    return body;
  }

  function handleError(error, req, res, recaptcha) {
    if (error) {
      res.render('forms/' + req.params['form'], {
        recaptcha_form: recaptcha.toHTML(),
        form_content: req.body,
        messages: {
          error: error
        }
      });
      return true;
    }
  }

  return routes;
};
