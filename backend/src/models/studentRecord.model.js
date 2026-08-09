const db = require('../config/db');

const StudentRecord = {
  findMatchingStudent(data, callback) {
    const sql = `
            SELECT
                id,
                student_id,
                faculty,
                name,
                department,
                year,
                is_active
            FROM student_records
            WHERE student_id = ?
              AND faculty = ?
              AND name = ?
              AND department = ?
              AND year = ?
              AND is_active = 1
            LIMIT 1
        `;

    db.query(
      sql,
      [data.student_id, data.faculty, data.name, data.department, data.year],
      callback
    );
  },
};

module.exports = StudentRecord;
