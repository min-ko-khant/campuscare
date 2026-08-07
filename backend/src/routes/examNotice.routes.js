const express = require("express");

const {
    getUpcomingExamNotices,
    getExamNoticeById
} = require("../controllers/examNotice.controller");

const router = express.Router();

router.get("/", getUpcomingExamNotices);
router.get("/:id", getExamNoticeById);

module.exports = router;