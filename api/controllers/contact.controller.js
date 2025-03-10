import Contact from '../models/contact.model.js';
import { sendContactNotification } from '../utils/email.js';

export const createContact = async (req, res, next) => {
  try {
    const { email, reason, message, legalConsent } = req.body;

    // Validate legal consent
    if (!legalConsent) {
      return res.status(400).json({
        success: false,
        message: 'Legal consent is required to submit the form',
      });
    }

    // Create new contact message
    const newContact = new Contact({
      email,
      reason,
      message,
      legalConsent,
    });

    // Save to database
    await newContact.save();

    // Send email notification
    const emailSent = await sendContactNotification({ email, reason, message });

    res.status(201).json({
      success: true,
      message:
        'Message saved successfully' +
        (emailSent
          ? ' and notification email sent'
          : ' but notification email failed'),
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};
