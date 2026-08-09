const db = require("../config/db");

const User = {

    create(data, callback) {

        const sql = `
            INSERT INTO users
            (
                student_id,
                name,
                email,
                password,
                role,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                data.student_id,
                data.name,
                data.email,
                data.password,
                data.role || "student",
                "pending"
            ],
            callback
        );
    },


    findByEmail(email, callback) {

        const sql = `
            SELECT *
            FROM users
            WHERE email = ?
            LIMIT 1
        `;

        db.query(sql, [email], callback);
    },


    findByStudentId(student_id, callback) {

        const sql = `
            SELECT *
            FROM users
            WHERE student_id = ?
            LIMIT 1
        `;

        db.query(sql, [student_id], callback);
    },


    findById(id, callback) {

        const sql = `
            SELECT
                id,
                student_id,
                name,
                email,
                role,
                status
            FROM users
            WHERE id = ?
            LIMIT 1
        `;

        db.query(sql, [id], callback);
    }

};


module.exports = User;