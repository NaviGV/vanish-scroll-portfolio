
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tags: [String],
  liveLink: String,
  codeLink: String,
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
