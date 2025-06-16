


const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Or your preferred service (e.g., 'SendGrid', 'SMTP')
      auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS  // Your email password/app-password from .env
      },
    });

    const mailOptions = {
      from: `"Eventify" <${process.env.EMAIL_USER}>`, // Sender address
      to: to,               // Recipient email address
      subject: subject,     // Subject of the email
      html: htmlContent,    // HTML content of the email
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to} with subject: "${subject}"`);
  } catch (error) {
    console.error(`Error sending email to ${to} with subject "${subject}":`, error);
    // Depending on your error handling strategy, you might re-throw the error
    // throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;