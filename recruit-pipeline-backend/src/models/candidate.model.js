const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  skills: [{
    type: String
  }],
  yearsOfExperience: {
    type: String
  },
  jobRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  stage: {
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Technical', 'HR', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  resume: {
    type: String // Cloudinary URL
  },
  resumePublicId: {
    type: String // Cloudinary Public ID for deletion
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Usually HR
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
