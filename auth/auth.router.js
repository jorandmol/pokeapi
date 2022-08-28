const express = require('express');
const router = express.Router();

const authHttpHandler = require('./auth.http');

router.route('/login')
    .post(authHttpHandler.userLogin);

exports.router = router;