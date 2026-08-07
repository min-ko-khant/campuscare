const db = require("../config/db");


const Search = {


    search(keyword, callback) {


        const sql = `


        SELECT
            id,
            title,
            summary AS description,
            image,
            'news' AS type

        FROM news

        WHERE
            title LIKE CONCAT('%', ?, '%')
            OR summary LIKE CONCAT('%', ?, '%')



        UNION ALL



        SELECT
            id,
            title,
            description,
            image,
            'event' AS type

        FROM events

        WHERE
            title LIKE CONCAT('%', ?, '%')
            OR description LIKE CONCAT('%', ?, '%')



        UNION ALL



        SELECT
            id,
            title,
            description,
            image,
            'activity' AS type

        FROM activities

        WHERE
            title LIKE CONCAT('%', ?, '%')
            OR description LIKE CONCAT('%', ?, '%')



        UNION ALL



        SELECT
            id,
            title,
            description,
            NULL AS image,
            'announcement' AS type

        FROM announcements

        WHERE
            title LIKE CONCAT('%', ?, '%')
            OR description LIKE CONCAT('%', ?, '%')



        UNION ALL



        SELECT
            id,
            title,
            description,
            NULL AS image,
            'emergency' AS type

        FROM emergency_notices

        WHERE
            title LIKE CONCAT('%', ?, '%')
            OR description LIKE CONCAT('%', ?, '%')



        UNION ALL



        SELECT
            id,
            title,
            description,
            NULL AS image,
            'exam' AS type

        FROM exam_notices

        WHERE
            title LIKE CONCAT('%', ?, '%')
            OR description LIKE CONCAT('%', ?, '%')



        ORDER BY title ASC


        `;



        db.query(

            sql,

            [

                keyword,
                keyword,

                keyword,
                keyword,

                keyword,
                keyword,

                keyword,
                keyword,

                keyword,
                keyword,

                keyword,
                keyword

            ],

            callback

        );


    }


};



module.exports = Search;