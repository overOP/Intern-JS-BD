const express = require('express');
const Signup = require('../controller/signup');
const Signin = require('../controller/signin');
const {
    forgotPassword,
    resetPassword,
  } = require('../controller/forgotPassword');
const router = express.Router()
router.post('/signup', Signup);
router.post('/signin', Signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
module.exports = router;