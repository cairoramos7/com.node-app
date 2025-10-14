const express = require('express');
const { updateUserName } = require('./user.controller');
const auth = require('../../presentation/auth/auth.middleware');

const router = express.Router();
router.put('/:id/name', auth, updateUserName);

module.exports = router;
