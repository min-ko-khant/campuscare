const db = require('../config/db');

const ActivityMedia = {
  getByActivityId(activityId, callback) {
    const sql = `
            SELECT
                id,
                activity_id,
                media_type,
                title,
                media_url,
                thumbnail,
                display_order,
                created_at
            FROM activity_media
            WHERE activity_id = ?
            ORDER BY display_order ASC, id ASC
        `;

    db.query(sql, [activityId], callback);
  },
};

module.exports = ActivityMedia;
