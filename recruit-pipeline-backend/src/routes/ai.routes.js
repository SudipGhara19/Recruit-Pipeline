const express = require('express');
const router = express.Router();
const { parseResume } = require('../controllers/ai.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// @desc    Parse resume text using AI
// @route   POST /api/ai/parse-resume
// @access  Private (HR Only)
router.post('/parse-resume', verifyToken, upload.single('resume'), parseResume);

module.exports = router;
