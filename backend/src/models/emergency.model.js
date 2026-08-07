const db = require("../config/db");

const Emergency = {
    getActive(callback) {
        const sql = `
            SELECT
                id,
                title,
                description,
                details,
                level,
                is_active,
                created_at
            FROM emergency_notices
            WHERE is_active = 1
            ORDER BY
                CASE
                    WHEN level = 'High' THEN 1
                    WHEN level = 'Medium' THEN 2
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
                details,
                level,
                is_active,
                created_at
            FROM emergency_notices
            WHERE id = ?
              AND is_active = 1
            LIMIT 1
        `;

        db.query(sql, [id], callback);
    }
};

module.exports = Emergency;