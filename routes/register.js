const express = require("express");
const router = express.Router();
const { handleNewUser } = require("../controllers/registrationController");

router.post("/", handleNewUser);

module.exports = router;
