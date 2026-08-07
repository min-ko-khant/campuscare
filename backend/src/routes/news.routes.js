const express = require("express");

const {
    getAllNews,
    getNewsById
} = require("../controllers/news.controller");

const router = express.Router();

router.get("/", getAllNews);
router.get("/:id", getNewsById);

module.exports = router;