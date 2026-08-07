const express = require("express");

const {
    getUpcomingEvents,
    getEventById
} = require("../controllers/event.controller");

const router = express.Router();

router.get("/", getUpcomingEvents);
router.get("/:id", getEventById);

module.exports = router;