beachenergy.ca
==============

[![Build Status](https://travis-ci.org/j0ni/beachenergy.ca.png?branch=master)](https://travis-ci.org/j0ni/beachenergy.ca)

I wrote this to support a local clean energy co-op, beachenergy.ca. A
while back, the co-op switched to some regular CMS solution, supported
by someone with more time than me.

For old time's sake, this code is sometimes still running on
http://beachenergy.j0ni.ca.

It is a simple node expressjs application, a small custom built CMS.

Copy the provided ```config-sample.js``` to ```config.js``` and modify
the contents according to your environment.

To run the tests:

    npm test

or

    make test

To run the app

    foreman start

or

    node server.js
