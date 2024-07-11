import { contactMailTamplate } from "../../utils/emailTemplates.js";
import { sendMail } from "../../utils/sendMail.js";

export const contact = async (req, res, next) => {
  const { name, email, mobile, query } = req.body;
  const subject = "Contact";
  const template = contactMailTamplate(name, email, mobile, query);
  await sendMail(email, subject, template);
  res.status(200).json({
    success: true,
    message: `Email sent successfully`,
  });
};

// // Define a custom type for the request object
