// more routes might be added later on

const express = require("express");
const router = express.Router();

const login = require("../controllers/login");
const signup = require("../controllers/signup");

const auth = require("../protected/auth");
const {getBLE, scanBLE} = require("../protected/bleMicroservice"); // we just retrieving what's there in metadata
const esp = require("../protected/esp32Microservice");

router.post("/login", login);
router.post("/signup", signup);
router.get("/get-ble", auth, getBLE);
router.post("/ble-scan", auth, scanBLE); // sends something called isIsolated or not?
router.get("/esp-mic", auth, esp);

module.exports = router;