
const express = require('express');
const Skill = require('../models/Skill');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all skills for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id }).sort({ name: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new skill
router.post('/', auth, async (req, res) => {
  try {
    const { name, level } = req.body;
    
    // Create new skill
    const newSkill = new Skill({
      user: req.user.id,
      name,
      level: level || 75 // Default level if not provided
    });
    
    const skill = await newSkill.save();
    
    res.status(201).json(skill);
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a skill
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, level } = req.body;
    
    // Find skill by ID and verify ownership
    let skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    if (skill.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    
    // Update fields
    skill.name = name || skill.name;
    skill.level = level !== undefined ? level : skill.level;
    
    await skill.save();
    
    res.json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a skill
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find skill by ID and verify ownership
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    if (skill.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    
    await skill.deleteOne();
    
    res.json({ message: 'Skill removed' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
