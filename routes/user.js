const express = require('express');
const { login, register, current } = require('../controllers/users');
const { auth } = require('../middleware/auth');
const router = express.Router();

/* api/user/login */
router.post('/login', login);

router.post('/register', register);

router.get('/current', auth, current);

module.exports = router;
 