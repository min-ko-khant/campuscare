const transporter = require('../config/mail.config');

async function sendContactEmail(contact) {
  const { name, email, phone, subject, message } = contact;

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_USER,

    replyTo: email,

    subject: `[CampusCare Feedback] ${subject}`,

    html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 650px;
                margin: auto;
                padding: 24px;
                color: #1e293b;
            ">

                <h2 style="color:#2563eb;">
                    CampusCare Feedback
                </h2>

                <hr>

                <p>
                    <strong>Name:</strong>
                    ${escapeHTML(name)}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHTML(email)}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHTML(phone || 'Not provided')}
                </p>

                <p>
                    <strong>Subject:</strong>
                    ${escapeHTML(subject)}
                </p>

                <div style="
                    margin-top:20px;
                    padding:18px;
                    background:#f8fafc;
                    border-radius:12px;
                ">
                    <strong>Message</strong>

                    <p style="line-height:1.7;">
                        ${escapeHTML(message).replace(/\n/g, '<br>')}
                    </p>
                </div>

                <hr style="margin-top:25px;">

                <p style="
                    font-size:12px;
                    color:#64748b;
                ">
                    Sent from CampusCare Contact Form
                </p>

            </div>
        `,
  };

  return transporter.sendMail(mailOptions);
}

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.MAIL_FROM,

    to: email,

    subject: 'CampusCare - Email Verification OTP',

    html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 24px;
                color: #1e293b;
            ">

                <h2 style="color:#2563eb;">
                    CampusCare Email Verification
                </h2>

                <p>
                    Use the following OTP to verify your
                    CampusCare student account.
                </p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    margin: 25px 0;
                ">
                    ${otp}
                </div>

                <p>
                    This OTP will expire in
                    <strong>2 minutes</strong>.
                </p>

                <p style="
                    font-size: 12px;
                    color: #64748b;
                    margin-top: 30px;
                ">
                    If you did not request this registration,
                    you can ignore this email.
                </p>

            </div>
        `,
  };

  return transporter.sendMail(mailOptions);
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

module.exports = {
  sendContactEmail,
  sendOTPEmail,
};
