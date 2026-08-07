const express = require("express");

const {
    getActiveEmergencies,
    getEmergencyById
} = require("../controllers/emergency.controller");

const router = express.Router();

router.get("/", getActiveEmergencies);
router.get("/:id", getEmergencyById);

module.exports = router;