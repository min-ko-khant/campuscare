const db = require('../config/db');

const OTP = {
  create(data, callback) {
    const sql = `
            INSERT INTO otp_codes
            (
                user_id,
                otp_code,
                expires_at
            )
            VALUES (?, ?, ?)
        `;

    db.query(sql, [data.user_id, data.otp_code, data.expires_at], callback);
  },

  findValid(user_id, otp_code, callback) {
    const sql = `
            SELECT *
            FROM otp_codes
            WHERE user_id = ?
            AND otp_code = ?
            AND expires_at > NOW()
            AND verified = FALSE
            ORDER BY id DESC
            LIMIT 1
        `;

    db.query(sql, [user_id, otp_code], callback);
  },

  markVerified(id, callback) {
    const sql = `
            UPDATE otp_codes
            SET verified = TRUE
            WHERE id = ?
        `;

    db.query(sql, [id], callback);
  },

  invalidateOld(user_id, callback) {
    const sql = `
        UPDATE otp_codes
        SET verified = TRUE
        WHERE user_id = ?
        AND verified = FALSE
    `;

    db.query(sql, [user_id], callback);
  },
  findLatest(user_id, callback) {
    const sql = `
        SELECT *
        FROM otp_codes
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;

    db.query(sql, [user_id], callback);
  },
};

module.exports = OTP;
