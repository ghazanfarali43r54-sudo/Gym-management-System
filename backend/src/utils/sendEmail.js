
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reusable email function
const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

// Check Gmail SMTP connection
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();

    console.log("Gmail SMTP connection successful");
  } catch (error) {
    console.error(
      "Gmail SMTP connection failed:",
      error.message
    );
  }
};

// Export functions after defining them
module.exports = {
  sendEmail,
  verifyEmailConnection,
};
