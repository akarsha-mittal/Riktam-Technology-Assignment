const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth_controller');
router.get('/', auth_controller.index);
router.post('/signin', auth_controller.signin);
router.post('/logout', auth_controller.logout);
module.exports = router;