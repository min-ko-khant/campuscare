const db = require("../config/db");

const Announcement = {
    getAll(callback) {
        const sql = `
            SELECT
                id,
                title,
                description,
                type,
                start_date,
                end_date,
                is_active,
                created_at
            FROM announcements
            WHERE is_active = 1
              AND (start_date IS NULL OR start_date <= CURDATE())
              AND (end_date IS NULL OR end_date >= CURDATE())
            ORDER BY
                CASE
                    WHEN type = 'Emergency' THEN 1
                    WHEN type = 'Academic' THEN 2
                    ELSE 3
                END,
                created_at DESC
        `;

        db.query(sql, callback);
    },

    getById(id, callback) {
        const sql = `
            SELECT
                id,
                title,
                description,
                type,
                start_date,
                end_date,
                is_active,
                created_at
            FROM announcements
            WHERE id = ?
              AND is_active = 1
            LIMIT 1
        `;

        db.query(sql, [id], callback);
    }
};

module.exports = Announcement;