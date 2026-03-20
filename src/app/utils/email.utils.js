const ejs = require("ejs");
const path = require("path");
const nodeMailerTransporter = require("../config/nodemailer.config");

const sendEmail = async ({ to, subject, templateName, templateData }) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "src",
      "app",
      "templates",
      `${templateName}.ejs`,
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const env = require("../config/env");

    const info = await nodeMailerTransporter.sendMail({
      from: `"Skill-Stream" <${env.EMAIL.USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Email error:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
