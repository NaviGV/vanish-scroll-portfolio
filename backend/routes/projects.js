
const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new project (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, image, tags, liveLink, codeLink } = req.body;
    
    const newProject = new Project({
      title,
      description,
      image, 
      tags: tags.split(',').map(tag => tag.trim()),
      liveLink,
      codeLink
    });
    
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
