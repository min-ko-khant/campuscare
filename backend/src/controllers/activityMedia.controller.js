const ActivityMedia = require("../models/activityMedia.model");
const getActivityMedia = (req, res) => {

    const activityId = Number(req.params.id);

    if (!Number.isInteger(activityId) || activityId <= 0) {

        return res.status(400).json({
            success: false,
            message: "Invalid activity ID"
        });

    }

    ActivityMedia.getByActivityId(activityId, (error, results) => {

        if (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Failed to load activity media"
            });

        }

        return res.status(200).json({

            success: true,

            count: results.length,

            data: results

        });

    });

};

module.exports = {

    getActivityMedia

};