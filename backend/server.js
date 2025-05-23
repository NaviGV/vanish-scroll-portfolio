
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

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://your-production-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Middleware
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
  // Check required email env variables
  if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    emailTransporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Verify transporter configuration
    emailTransporter.verify(function(error, success) {
      if (error) {
        console.error('Email transporter verification failed:', error);
      } else {
        console.log('Email server is ready to send messages');
      }
    });
  } else {
    console.warn('Email configuration is incomplete. Email notifications will not work.');
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
app.use('/api/skills', require('./routes/skills'));

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

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
