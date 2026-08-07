const express = require("express");
const { body } = require("express-validator");

const {
    submitContact
} = require("../controllers/contact.controller");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Contact API Working"
    });
});

router.post(
    "/",
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required"),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Valid email is required"),

        body("subject")
            .trim()
            .notEmpty()
            .withMessage("Subject is required"),

        body("message")
            .trim()
            .notEmpty()
            .withMessage("Message is required")
    ],
    submitContact
);

module.exports = router;