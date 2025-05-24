
const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/projects');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'project-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

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

// Upload project image
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const filePath = `/uploads/projects/${req.file.filename}`;
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${serverUrl}${filePath}`;
    
    res.json({ imageUrl });
  } catch (error) {
    console.error('Project image upload error:', error);
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
      tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags,
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

// Update a project (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, image, tags, liveLink, codeLink } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.image = image || project.image;
    project.tags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags || project.tags;
    project.liveLink = liveLink || project.liveLink;
    project.codeLink = codeLink || project.codeLink;
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
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
