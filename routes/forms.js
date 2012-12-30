"use strict";

/* global require, exports, module, console */

var nodemailer = require('nodemailer'),
    config = require('../config'),
    Recaptcha = require('recaptcha').Recaptcha,
    util = require('util');

exports = module.exports = function () {
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
        var transport = nodemailer.createTransport(config.email.name, config.email.options);
        transport.sendMail({
          from: 'web@beachenergy.ca',
          to: 'j@lollyshouse.ca',
          subject: 'new signup form',
          text: util.inspect(req.body)
        }, function (error, response) {
          if (error)
            console.log(error);

          transport.close();
        });

        req.flash('success', "Thank you! We'll be in touch.");
        res.redirect('/');
        return;
      }

      res.render('forms/' + req.params['form'], {
        recaptcha_form: recaptcha.toHTML(),
        form_content: req.body,
        messages: {
          error: 'Recaptcha error - please try again'
        }
      });
    });
  };

  return routes;
};
