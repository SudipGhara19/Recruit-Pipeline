const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Interview', 'Rejected', 'Selected'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
