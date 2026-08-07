const News = require("../models/news.model");

const getAllNews = (req, res) => {
    News.getAll((error, results) => {
        if (error) {
            console.error("Get all news error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch news"
            });
        }

        return res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    });
};

const getNewsById = (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid news ID"
        });
    }

    News.getById(id, (error, results) => {
        if (error) {
            console.error("Get news by ID error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch news"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "News not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};

module.exports = {
    getAllNews,
    getNewsById
};