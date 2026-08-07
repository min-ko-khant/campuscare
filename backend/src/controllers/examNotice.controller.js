const ExamNotice = require("../models/examNotice.model");

const getUpcomingExamNotices = (req, res) => {
    ExamNotice.getUpcoming((error, results) => {
        if (error) {
            console.error("Get exam notices error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch exam notices"
            });
        }

        return res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    });
};

const getExamNoticeById = (req, res) => {
    const noticeId = Number(req.params.id);

    if (!Number.isInteger(noticeId) || noticeId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid exam notice ID"
        });
    }

    ExamNotice.getById(noticeId, (error, results) => {
        if (error) {
            console.error("Get exam notice by ID error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch exam notice"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Exam notice not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};

module.exports = {
    getUpcomingExamNotices,
    getExamNoticeById
};