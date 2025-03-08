// more routes might be added later on

const express = require("express");
const router = express.Router();

const login = require("../controllers/login");
const signup = require("../controllers/signup");

const auth = require("../protected/auth");
const ble = require("../protected/bleMicroservice");
const esp = require("../protected/espMicroservice");

router.post("/login", login);
router.post("/signup", signup);

router.get("/ble-mic", auth, ble);
router.get("/esp-mic", auth, esp);

module.exports = router;