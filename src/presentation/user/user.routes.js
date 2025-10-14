const express = require('express');
const auth = require('../../presentation/auth/auth.middleware');

module.exports = (userController) => {
  const router = express.Router();
  router.put('/:id/name', auth, userController.updateUserName);
  router.put('/:id/email/request-update', auth, userController.requestEmailUpdate);
  router.put('/:id/email/confirm-update', auth, userController.confirmEmailUpdate);
  return router;
};
