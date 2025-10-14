const express = require("express");
const auth = require("@src/presentation/auth/auth.middleware");

const router = express.Router();

module.exports = (authController) => {
  router.post("/register", authController.register);

  router.post("/login", authController.login);

  router.get("/whoami", auth, authController.whoami);

  return router;
};
