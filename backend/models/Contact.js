
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
    enum: ['new', 'responded', 'completed'],
    default: 'new',
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  notificationEmail: {
    type: String,
    default: 'hello@example.com',
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
