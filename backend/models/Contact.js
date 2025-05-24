
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'completed'],
    default: 'pending',
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  notificationEmail: {
    type: String,
    default: 'admin@example.com',
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
