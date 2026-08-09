const db = require('../config/db');

const ExamNotice = {
  getUpcoming(callback) {
    const sql = `
            SELECT
                id,
                title,
                department,
                description,
                file_url,
                exam_date,
                created_at
            FROM exam_notices
            WHERE exam_date IS NOT NULL
              AND exam_date >= CURDATE()
            ORDER BY exam_date ASC, created_at DESC
        `;

    db.query(sql, callback);
  },

  getById(id, callback) {
    const sql = `
            SELECT
                id,
                title,
                department,
                description,
                file_url,
                exam_date,
                created_at
            FROM exam_notices
            WHERE id = ?
            LIMIT 1
        `;

    db.query(sql, [id], callback);
  },
};

module.exports = ExamNotice;
