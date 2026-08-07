const db = require("../config/db");

const Contact = {

    create(data, callback) {

        const sql = `
            INSERT INTO contact_messages
            (
                name,
                email,
                phone,
                subject,
                message
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                data.name,
                data.email,
                data.phone,
                data.subject,
                data.message
            ],
            callback
        );

    }

};

module.exports = Contact;