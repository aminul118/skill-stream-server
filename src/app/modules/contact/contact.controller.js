const sendEmail = require('../../utils/email.utils');
const env = require('../../config/env');

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields (name, email, subject, message).',
      });
    }

    // 1. Send confirmation email to the User
    await sendEmail({
      to: email,
      subject: 'Thanks for contacting us! | Skill-Stream',
      templateName: 'contactReply',
      templateData: {
        name,
        adminName: 'Skill Stream Support',
      },
    });

    // 2. Send notification email to the Admin
    const adminEmail = env.EMAIL.USER || 'admin@skill-stream.com'; // Fallback if no specific admin email is configured
    await sendEmail({
      to: adminEmail,
      subject: `New Contact Inquiry: ${subject}`,
      templateName: 'contactAdmin',
      templateData: {
        name,
        email,
        message,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully to authority.',
      data: { name, email },
    });
  } catch (error) {
    console.error('Contact Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message.',
    });
  }
};

module.exports = {
  createContact,
};
