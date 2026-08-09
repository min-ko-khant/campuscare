const db = require('../config/db');

const LoginLog = {
  create(data, callback) {
    const sql = `
            INSERT INTO login_logs
            (
                user_id,
                ip_address,
                user_agent,
                login_status
            )
            VALUES (?, ?, ?, ?)
        `;

    db.query(
      sql,
      [
        data.user_id || null,
        data.ip_address || null,
        data.user_agent || null,
        data.login_status,
      ],
      callback
    );
  },
};

module.exports = LoginLog;
