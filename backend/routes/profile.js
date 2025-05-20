
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Update user profile
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

module.exports = router;
