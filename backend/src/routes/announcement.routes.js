const express = require("express");

const {
    getAllAnnouncements,
    getAnnouncementById
} = require("../controllers/announcement.controller");

const router = express.Router();

router.get("/", getAllAnnouncements);
router.get("/:id", getAnnouncementById);

module.exports = router;