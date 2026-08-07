const express = require("express");

const {

    getActivityMedia

} = require("../controllers/activityMedia.controller");

const router = express.Router();

router.get("/:id/media", getActivityMedia);

module.exports = router;