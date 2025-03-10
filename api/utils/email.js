import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Log email configuration (without showing the actual password)
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_APP_PASSWORD;

console.log('Environment Variables Check:');
console.log('- EMAIL_USER:', emailUser ? `Set (${emailUser})` : 'Missing');
console.log(
  '- EMAIL_APP_PASSWORD:',
  emailPass ? 'Set (length: ' + emailPass.length + ')' : 'Missing'
);

if (!emailUser || !emailPass) {
  console.error('Email configuration missing:', {
    EMAIL_USER: emailUser ? 'Set' : 'Missing',
    EMAIL_APP_PASSWORD: emailPass ? 'Set' : 'Missing',
  });
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  debug: true, // Enable debug logging
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendContactNotification = async (contactData) => {
  const { email, reason, message } = contactData;

  // Email to admin (notification)
  const adminMailOptions = {
    from: emailUser,
    to: emailUser, // Send to yourself
    subject: `My Portfolio Contact Form - ${reason}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${email}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
      <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
    `,
  };

  // Email to sender (acknowledgment)
  const senderMailOptions = {
    from: emailUser,
    to: email,
    subject: 'Thank you for contacting me',
    html: `
      <h2>Thank you for your message!</h2>
      <p>I have received your email regarding "${reason}".</p>
      <p>I'll get back to you as soon as possible.</p>
      <br>
      <h3>Your message:</h3>
      <p style="white-space: pre-wrap;">${message}</p>
      <p><em>Sent at: ${new Date().toLocaleString()}</em></p>
      <br>
      <p>Best regards,</p>
      <p>Alessandro</p>
    `,
  };

  try {
    console.log('Attempting to send emails...');
    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(senderMailOptions),
    ]);
    console.log('Emails sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending emails:', {
      error: error.message,
      code: error.code,
      command: error.command,
    });
    return false;
  }
};
