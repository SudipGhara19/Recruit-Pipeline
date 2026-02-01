const Candidate = require('../models/candidate.model');
const User = require('../models/user.model');
const UserData = require('../models/userData.model');
const cloudinary = require('../config/cloudinary');
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');

// @desc    Add a new candidate (with resume upload)
// @route   POST /api/candidates
// @access  Private (HR Only)
const addCandidate = async (req, res, next) => {
  try {
    const { fullName, email, phone, skills, yearsOfExperience, jobRole, stage } = req.body;

    if (req.user.role !== 'HR') {
        if (req.file) await fs.unlink(req.file.path);
        res.status(403);
        throw new Error('Not authorized. Only HR can add candidates.');
    }

    // Check if candidate already exists in the Candidate collection
    const candidateExists = await Candidate.findOne({ email });
    if (candidateExists) {
        if (req.file) await fs.unlink(req.file.path);
        res.status(400);
        throw new Error('Candidate with this email already exists.');
    }

    // Check if user already exists in User collection
    const userExists = await User.findOne({ email });
    if (userExists) {
        if (req.file) await fs.unlink(req.file.path);
        res.status(400);
        throw new Error('User with this email already exists.');
    }

    let resumeUrl = '';
    let resumePublicId = '';
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'resumes',
                resource_type: 'auto',
                access_mode: 'public'
            });
            resumeUrl = result.secure_url;
            resumePublicId = result.public_id; // Capture public_id
            await fs.unlink(req.file.path); // Clean temp file
        } catch (error) {
            if (req.file) await fs.unlink(req.file.path);
            throw new Error('Resume upload failed: ' + error.message);
        }
    }

    // Prepare skills array
    const skillsArray = skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [];

    // Create Candidate entry
    let candidate = await Candidate.create({
      fullName,
      email,
      phone,
      skills: skillsArray,
      yearsOfExperience,
      jobRole,
      stage: stage || 'Applied',
      resume: resumeUrl,
      resumePublicId: resumePublicId || '', // Store public_id
      addedBy: req.user.id
    });

    // Populate the newly created candidate
    candidate = await Candidate.findById(candidate._id).populate('jobRole', 'postName').populate('addedBy', 'fullName');

    // Create User entry for the candidate (password = email)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(email, salt);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: 'Candidate'
    });

    // Create UserData entry and sync with Candidate info
    await UserData.create({
        userId: user._id,
        fullName,
        email,
        phone,
        resume: resumeUrl,
        resumePublicId: resumePublicId || '', // Store public_id in UserData too
        skills: skillsArray,
        experience: yearsOfExperience,
        jobRole,
        stage: stage || 'Applied'
    });

    res.status(201).json({
      message: 'Candidate added and User created successfully',
      candidate,
      user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private (HR or Recruiter)
const getCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find().populate('jobRole', 'postName').populate('addedBy', 'fullName');
    res.json(candidates);
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate details
// @route   PUT /api/candidates/:id
// @access  Private (HR Only)
const updateCandidate = async (req, res, next) => {
  try {
    if (req.user.role !== 'HR') {
      res.status(403);
      throw new Error('Not authorized. Only HR can update candidates.');
    }

    let candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('jobRole', 'postName').populate('addedBy', 'fullName');

    if (!candidate) {
      res.status(404);
      throw new Error('Candidate not found');
    }

    // Sync with UserData if stage is updated
    if (req.body.stage) {
      await UserData.findOneAndUpdate(
        { email: candidate.email },
        { stage: req.body.stage }
      );
    }

    res.json({
      message: 'Candidate updated successfully',
      candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private (HR Only)
const deleteCandidate = async (req, res, next) => {
  try {
    if (req.user.role !== 'HR') {
      res.status(403);
      throw new Error('Not authorized. Only HR can delete candidates.');
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      res.status(404);
      throw new Error('Candidate not found');
    }

    // 1. Delete resume from Cloudinary if it exists
    if (candidate.resumePublicId) {
      try {
        await cloudinary.uploader.destroy(candidate.resumePublicId);
      } catch (error) {
        console.error('Failed to delete resume from Cloudinary:', error.message);
        // Continue with DB deletion even if Cloudinary fails
      }
    }

    // 2. Find and delete the User and UserData entries
    const user = await User.findOne({ email: candidate.email });
    if (user) {
        await UserData.findOneAndDelete({ userId: user._id });
        await User.findByIdAndDelete(user._id);
    } else {
        // Fallback: delete UserData by email if User is missing for some reason
        await UserData.findOneAndDelete({ email: candidate.email });
    }

    // 3. Finally delete the Candidate record
    await Candidate.findByIdAndDelete(req.params.id);

    res.json({ message: 'Candidate and associated data removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCandidate,
  getCandidates,
  updateCandidate,
  deleteCandidate
};
