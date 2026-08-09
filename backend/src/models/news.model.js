const db = require('../config/db');

const News = {
  getAll(callback) {
    const sql = `
            SELECT
                id,
                title,
                slug,
                category,
                summary,
                content,
                image,
                author,
                views,
                is_published,
                created_at,
                updated_at
            FROM news
            WHERE is_published = 1
            ORDER BY created_at DESC
        `;

    db.query(sql, callback);
  },

  getById(id, callback) {
    const sql = `
            SELECT
                id,
                title,
                slug,
                category,
                summary,
                content,
                image,
                author,
                views,
                is_published,
                created_at,
                updated_at
            FROM news
            WHERE id = ?
              AND is_published = 1
            LIMIT 1
        `;

    db.query(sql, [id], callback);
  },
};

module.exports = News;
