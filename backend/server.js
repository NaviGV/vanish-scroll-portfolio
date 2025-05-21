
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const nodemailer = require('nodemailer');

// Load env variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Initial setup for admin user
const User = require('./models/User');
const setupAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const adminUser = new User({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Software Developer',
        location: 'San Francisco, California',
        social: {
          github: 'https://github.com',
          twitter: 'https://twitter.com'
        },
        skills: ['React', 'Node.js', 'MongoDB']
      });
      await adminUser.save();
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Admin setup error:', error);
  }
};

setupAdmin();

// Configure email transporter
let emailTransporter = null;
try {
  if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    emailTransporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log('Email transporter configured');
  }
} catch (error) {
  console.error('Email setup error:', error);
}

// Make email transporter available to routes
app.use((req, res, next) => {
  req.emailTransporter = emailTransporter;
  next();
});

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/profile', require('./routes/profile'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
