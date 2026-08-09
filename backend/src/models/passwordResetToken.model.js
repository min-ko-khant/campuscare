const db = require('../config/db');

const PasswordResetToken = {
  create(data, callback) {
    const sql = `
            INSERT INTO password_reset_tokens
            (
                user_id,
                token,
                expires_at
            )
            VALUES (?, ?, ?)
        `;

    db.query(sql, [data.user_id, data.token, data.expires_at], callback);
  },

  findValid(token, callback) {
    const sql = `
            SELECT *
            FROM password_reset_tokens
            WHERE token = ?
            AND used = 0
            AND expires_at > NOW()
            LIMIT 1
        `;

    db.query(sql, [token], callback);
  },

  markUsed(id, callback) {
    const sql = `
            UPDATE password_reset_tokens
            SET used = 1
            WHERE id = ?
        `;

    db.query(sql, [id], callback);
  },
};

module.exports = PasswordResetToken;
