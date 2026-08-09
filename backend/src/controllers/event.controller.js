const Event = require('../models/event.model');

const getUpcomingEvents = (req, res) => {
  Event.getUpcoming((error, results) => {
    if (error) {
      console.error('Get upcoming events error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming events',
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};

const getEventById = (req, res) => {
  const eventId = Number(req.params.id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event ID',
    });
  }

  Event.getById(eventId, (error, results) => {
    if (error) {
      console.error('Get event by ID error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch event',
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: results[0],
    });
  });
};

module.exports = {
  getUpcomingEvents,
  getEventById,
};
