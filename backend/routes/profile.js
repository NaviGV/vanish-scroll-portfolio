
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for profile images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/images');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use timestamp and original extension for unique filenames
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for resume files
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/resumes');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use timestamp and original extension for unique filenames
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create upload instances
const uploadImage = multer({ 
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

const uploadResume = multer({ 
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, or DOCX files are allowed!'));
  }
});

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    // Get profile fields to update
    const { name, email, role, location, social, skills, education } = req.body;
    
    // Build profile update object
    const profileUpdateFields = {};
    if (name) profileUpdateFields.name = name;
    if (email) profileUpdateFields.email = email;
    if (role) profileUpdateFields.role = role;
    if (location) profileUpdateFields.location = location;
    if (social) profileUpdateFields.social = social;
    if (skills) profileUpdateFields.skills = skills;
    if (education) profileUpdateFields.education = education;
    
    // Update profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileUpdateFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile image
router.post('/upload-image', [auth, uploadImage.single('profileImage')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    // Generate file URL
    const imageUrl = `/uploads/images/${req.file.filename}`;
    
    // Update user profile with new image URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload resume file
router.post('/upload-resume', [auth, uploadResume.single('resume')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file provided' });
    }
    
    // Generate file URL
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    
    // Update user profile with new resume URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl: resumeUrl },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
