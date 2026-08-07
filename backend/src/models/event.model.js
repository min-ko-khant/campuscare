const db = require("../config/db");

const Event = {
    getUpcoming(callback) {
        const sql = `
            SELECT
                id,
                title,
                category,
                description,
                location,
                image,
                event_date,
                start_time,
                end_time,
                created_at
            FROM events
            WHERE event_date IS NOT NULL
              AND event_date >= CURDATE()
            ORDER BY event_date ASC, start_time ASC
        `;

        db.query(sql, callback);
    },

    getById(id, callback) {
        const sql = `
            SELECT
                id,
                title,
                category,
                description,
                location,
                image,
                event_date,
                start_time,
                end_time,
                created_at
            FROM events
            WHERE id = ?
            LIMIT 1
        `;

        db.query(sql, [id], callback);
    }
};

module.exports = Event;