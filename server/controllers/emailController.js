const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

// Send email
const sendEmail = async (
  req,
  res
) => {
  try {
    const {
      to,
      subject,
      message,
    } = req.body;

    if (
      !to ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        message:
          "Please fill all email fields",
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    });

    res.json({
      message:
        "Email sent successfully",
    });
  } catch (error) {
    console.log(
      "Email error:",
      error
    );

    res.status(500).json({
      message:
        "Could not send email",
    });
  }
};

module.exports = {
  sendEmail,
};