﻿// The MIT License (MIT)

// Copyright (c) 2015 Jason Watmore

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    res.render('register');
});

router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('register', { error: 'An error has occurred. Please try again.' });
        }

        if (response.statusCode !== 200) {
            return res.render('register', {
                error: response.body,
                username: req.body.username
            });
        }

        // return to login page with success message
        req.session.success = 'Registration successful! You may now login.';
        return res.redirect('/login');
    });
});

module.exports = router;