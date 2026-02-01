const express = require('express');
const router = express.Router();
const { createJob, getJobs, updateJob, deleteJob } = require('../controllers/job.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', getJobs);
router.post('/', verifyToken, createJob);
router.put('/:id', verifyToken, updateJob);
router.delete('/:id', verifyToken, deleteJob);

module.exports = router;
