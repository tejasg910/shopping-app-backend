import nodemailer from "nodemailer";
import { config } from "dotenv";
config({ path: "./.env" });
// Create a transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

console.log(
  process.env.GMAIL_USERNAME,
  process.env.GMAIL_PASSWORD,
  "email and password"
);

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Send an email

export const sendMail = async (email, subject, content) => {
  const mailOptions = {
    from: "tejasgiri910@gmail.com",
    to: email,
    subject: subject,
    text: content,
    html: content,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error, "error in email");
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
