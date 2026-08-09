const Announcement = require('../models/announcement.model');

const getAllAnnouncements = (req, res) => {
  Announcement.getAll((error, results) => {
    if (error) {
      console.error('Get announcements error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch announcements',
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};

const getAnnouncementById = (req, res) => {
  const { id } = req.params;
  const announcementId = Number(id);

  if (!Number.isInteger(announcementId) || announcementId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid announcement ID',
    });
  }

  Announcement.getById(announcementId, (error, results) => {
    if (error) {
      console.error('Get announcement by ID error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch announcement',
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: results[0],
    });
  });
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
};
