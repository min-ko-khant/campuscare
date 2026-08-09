const db = require('../config/db');

const RefreshToken = {
  create(data, callback) {
    const sql = `
            INSERT INTO refresh_tokens
            (
                user_id,
                token,
                expires_at
            )
            VALUES (?, ?, ?)
        `;

    db.query(sql, [data.user_id, data.token, data.expires_at], callback);
  },

  find(token, callback) {
    const sql = `
        SELECT *
        FROM refresh_tokens
        WHERE token = ?
        AND expires_at > NOW()
        LIMIT 1
    `;

    db.query(sql, [token], callback);
  },

  delete(token, callback) {
    const sql = `
            DELETE FROM refresh_tokens
            WHERE token = ?
        `;

    db.query(sql, [token], callback);
  },
};

module.exports = RefreshToken;
