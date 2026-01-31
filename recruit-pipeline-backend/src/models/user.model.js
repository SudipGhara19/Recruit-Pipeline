const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false // Optional, can use _id as userId or auto-generate
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['HR', 'Recruiter', 'Candidate'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
