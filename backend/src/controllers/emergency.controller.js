const Emergency = require("../models/emergency.model");

const getActiveEmergencies = (req, res) => {
    Emergency.getActive((error, results) => {
        if (error) {
            console.error("Get emergencies error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch emergency notices"
            });
        }

        return res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    });
};

const getEmergencyById = (req, res) => {
    const emergencyId = Number(req.params.id);

    if (!Number.isInteger(emergencyId) || emergencyId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid emergency ID"
        });
    }

    Emergency.getById(emergencyId, (error, results) => {
        if (error) {
            console.error("Get emergency by ID error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch emergency notice"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Emergency notice not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};

module.exports = {
    getActiveEmergencies,
    getEmergencyById
};