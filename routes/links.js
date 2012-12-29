"use strict";

/* global exports, console, require, module */

var shared = require('./shared'),
    checkError = shared.checkError,
    checkSaveError = shared.checkSaveError,
    checkAuth = shared.checkAuth,
    getQuery = shared.getQuery,
    getTags = shared.getTags,
    ObjectId = require('mongoose').Types.ObjectId;

exports = module.exports = function (Link) {
  var routes = {};

  routes.new = function (req, res) {
    if (checkAuth(req, res, 'admin'))
      return;

    sendForm(new Link(), res);
  };

  routes.edit = function (req, res) {
    if (checkAuth(req, res, 'admin'))
      return;

    Link.findOne({ _id: ObjectId.fromString(req.params['id']) }, function (error, link) {
      if (checkError(error, req, res))
        return;

      if (!link) {
        req.flash('error', 'Link not found');
        res.redirect('/');
        return;
      }

      sendForm(link, res);
    });
  };

  routes.create = function (req, res) {
    if (checkAuth(req, res, 'admin'))
      return;

    buildLink(req.body).save(function (error, link) {
      if (checkSaveError(error, req, res))
        return;

      req.flash('success', 'Link saved');
      res.redirect('/');
    });
  };

  routes.update = function (req, res) {
    if (checkAuth(req, res, 'admin'))
      return;

    Link.findOne({ _id: ObjectId.fromString(req.params['id']) }, function (error, link) {
      if (checkError(error, req, res))
        return;

      if (!link) {
        req.flash('error', 'Link not found');
        res.redirect('/');
        return;
      }

      buildLink(req.body, link).save(function (error, link) {
        if (checkSaveError(error, req, res))
          return;

        req.flash('success', 'Link updated');
        res.redirect('/');
      });
    });
  };

  function buildLink(params, link) {
    link = link || new Link();

    link.url = params['url'] || link.url;
    link.text = params['text'] || link.text;
    link.tags = getTags(params) || link.tags;

    return link;
  }

  function sendForm(link, res) {
    res.render('links/form', { link: link });
  }

  return routes;
};
