const { validationResult } = require("express-validator");

const Contact = require("../models/contact.model");

const { sendContactEmail } = require("../services/mail.service");


const submitContact = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({

            success: false,

            errors: errors.array()

        });

    }

    try {

        const contact = {

            name: req.body.name.trim(),

            email: req.body.email.trim(),

            phone: req.body.phone?.trim() || "",

            subject: req.body.subject.trim(),

            message: req.body.message.trim()

        };


        Contact.create(contact, async (error) => {

            if (error) {

                console.error(error);

                return res.status(500).json({

                    success: false,

                    message: "Database error"

                });

            }

            try {

                await sendContactEmail(contact);

            }

            catch (mailError) {

                console.error(mailError);

            }

            return res.json({

                success: true,

                message: "Feedback sent successfully."

            });

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    submitContact

};
