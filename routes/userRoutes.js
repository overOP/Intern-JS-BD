const express = require('express');
const Signup = require('../controller/signup');
const Signin = require('../controller/signin');
const router = express.Router()
router.post('/signup', Signup);
router.post('/signin', Signin);
module.exports = router;