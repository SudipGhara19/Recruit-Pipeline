const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  resume: { type: String }, // URL to resume
  resumePublicId: { type: String }, // Cloudinary Public ID
  skills: [{ type: String }],
  experience: { type: String },
  jobRole: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  stage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('UserData', userDataSchema);
