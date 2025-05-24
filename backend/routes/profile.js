
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'profileImage') {
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(new Error('Only image files are allowed!'));
    } else if (file.fieldname === 'resumeFile') {
      const filetypes = /pdf|doc|docx/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      
      if (extname) {
        return cb(null, true);
      }
      cb(new Error('Only PDF, DOC, or DOCX files are allowed!'));
    } else {
      cb(new Error('Unexpected field'));
    }
  }
});

// Get public profile (no auth required)
router.get('/public', async (req, res) => {
  try {
    const user = await User.findOne().select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ message: 'Server error' });
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

// Update user profile with text fields
router.patch('/', auth, async (req, res) => {
  try {
    const { name, email, role, location, social, skills, education, resumeUrl } = req.body;
    
    // Fields to update
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    if (role) profileFields.role = role;
    if (location) profileFields.location = location;
    if (social) profileFields.social = social;
    if (skills) profileFields.skills = skills;
    if (education) profileFields.education = education;
    if (resumeUrl) profileFields.resumeUrl = resumeUrl;
    
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile picture
router.post('/upload-image', auth, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get file path
    const filePath = `/uploads/${req.file.filename}`;
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${serverUrl}${filePath}`;
    
    // Update user profile with new image URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePicture: fileUrl } },
      { new: true }
    ).select('-password');
    
    res.json({ 
      message: 'Profile picture uploaded successfully',
      profilePicture: fileUrl,
      user
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload resume file
router.post('/upload-resume', auth, upload.single('resumeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get file path
    const filePath = `/uploads/${req.file.filename}`;
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${serverUrl}${filePath}`;
    
    // Update user profile with new resume URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { resumeUrl: fileUrl } },
      { new: true }
    ).select('-password');
    
    res.json({ 
      message: 'Resume uploaded successfully',
      resumeUrl: fileUrl,
      user
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user credentials
router.patch('/credentials', auth, async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If changing password, verify current password
    if (newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      user.password = newPassword;
    }
    
    // Update username if provided
    if (username && username !== user.username) {
      // Check if username already exists
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      
      user.username = username;
    }
    
    await user.save();
    
    res.json({ message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Update credentials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
