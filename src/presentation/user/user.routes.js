const express = require('express');
const { updateUserName, requestEmailUpdate, confirmEmailUpdate } = require('./user.controller');
const auth = require('../../presentation/auth/auth.middleware');

const router = express.Router();
router.put('/:id/name', auth, updateUserName);
router.put('/:id/email/request-update', auth, requestEmailUpdate);
router.put('/:id/email/confirm-update', auth, confirmEmailUpdate);

module.exports = router;
