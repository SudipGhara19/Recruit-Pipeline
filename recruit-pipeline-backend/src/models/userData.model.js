const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Add other specific fields here as needed
  phone: { type: String },
  address: { type: String },
  resume: { type: String }, // URL to resume
  skills: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('UserData', userDataSchema);
