const express = require('express');

const {
  getUpcomingActivities,
  getActivityById,
} = require('../controllers/activity.controller');

const router = express.Router();

router.get('/', getUpcomingActivities);
router.get('/:id', getActivityById);

module.exports = router;
