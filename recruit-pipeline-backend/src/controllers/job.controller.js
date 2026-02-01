const Job = require('../models/job.model');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
const createJob = async (req, res, next) => {
  try {
    const { postName, Description, salary, keySkills } = req.body;

    if (req.user.role !== 'Recruiter') {
      res.status(403);
      throw new Error('Not authorized. Only Recruiters can post jobs.');
    }

    const job = await Job.create({
      postName,
      Description,
      salary,
      keySkills,
      postedBy: req.user.id
    });

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'fullName email');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter owner only)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Check if user is Recruiter and the owner
    if (req.user.role !== 'Recruiter' || job.postedBy.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this job. Only the posting recruiter can update it.');
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter owner only)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Check if user is Recruiter and the owner
    if (req.user.role !== 'Recruiter' || job.postedBy.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this job. Only the posting recruiter can delete it.');
    }

    await job.deleteOne();
    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob
};
