const nodemailer = require('nodemailer');
const env = require('./env');

const nodeMailerTransporter = nodemailer.createTransport({
  host: env.EMAIL.HOST,
  port: env.EMAIL.PORT,
  secure: env.EMAIL.SECURE,
  auth: {
    user: env.EMAIL.USER,
    pass: env.EMAIL.PASS,
  },
});

module.exports = nodeMailerTransporter;
