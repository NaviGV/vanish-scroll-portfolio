
const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure email transporter
const setupTransporter = () => {
  try {
    if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
    return null;
  } catch (error) {
    console.error('Email setup error:', error);
    return null;
  }
};

// Send email notification
const sendEmailNotification = async (contact) => {
  try {
    const transporter = setupTransporter();
    if (!transporter) {
      console.log('Email not configured, skipping notification');
      return false;
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL || contact.notificationEmail;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: notificationEmail,
      subject: `New Contact Form Submission: ${contact.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>You can manage this message in your admin dashboard.</p>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Submit contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      notificationEmail: process.env.NOTIFICATION_EMAIL || 'hello@example.com'
    });
    
    const savedContact = await newContact.save();
    
    // Send email notification
    const emailSent = await sendEmailNotification(savedContact);
    if (emailSent) {
      savedContact.notificationSent = true;
      await savedContact.save();
    }
    
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contact messages (auth required)
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact status (auth required)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'responded', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    contact.status = status;
    await contact.save();
    
    res.json(contact);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
