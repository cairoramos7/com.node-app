const express = require("express");
const { register, login, whoami } = require("@src/presentation/auth/auth.controller");
const auth = require("@src/presentation/auth/auth.middleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/whoami", auth, whoami);

module.exports = router;
