const db = require("../config/db");

const Activity = {
    getUpcoming(callback) {
        const sql = `
            SELECT
                id,
                title,
                category,
                description,
                image,
                activity_date,
                created_at
            FROM activities
            WHERE activity_date IS NOT NULL
              AND activity_date >= CURDATE()
            ORDER BY activity_date ASC, created_at DESC
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
                image,
                activity_date,
                created_at
            FROM activities
            WHERE id = ?
            LIMIT 1
        `;

        db.query(sql, [id], callback);
    }
};

module.exports = Activity;