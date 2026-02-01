const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  postName: {
    type: String,
    required: true,
    trim: true
  },
  Description: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  keySkills: [{
    type: String,
    required: true
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
