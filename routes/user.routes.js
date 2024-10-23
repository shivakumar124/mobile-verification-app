const express = require('express');
const { sendVerificationCode, verifyCode } = require('../controllers/user.controller');
const authenticateJWT = require('../middlewares/auth');

const router = express.Router();

router.post('/send-code', sendVerificationCode);
router.post('/verify-code', verifyCode);

module.exports = router;