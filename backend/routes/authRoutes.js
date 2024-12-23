const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCandidates,
  logout,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/candidates", getCandidates);

module.exports = router;
