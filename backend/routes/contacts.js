
const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const router = express.Router();

// Submit contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });
    
    const savedContact = await newContact.save();
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
