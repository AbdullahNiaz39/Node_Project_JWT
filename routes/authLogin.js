const express = require("express");
const router = express.Router();
const { LoginUser } = require("../controllers/authController");

router.post("/", LoginUser);

module.exports = router;
