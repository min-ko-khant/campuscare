const Activity = require('../models/activity.model');

const getUpcomingActivities = (req, res) => {
  Activity.getUpcoming((error, results) => {
    if (error) {
      console.error('Get upcoming activities error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch activities',
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};

const getActivityById = (req, res) => {
  const activityId = Number(req.params.id);

  if (!Number.isInteger(activityId) || activityId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid activity ID',
    });
  }

  Activity.getById(activityId, (error, results) => {
    if (error) {
      console.error('Get activity by ID error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch activity',
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: results[0],
    });
  });
};

module.exports = {
  getUpcomingActivities,
  getActivityById,
};
