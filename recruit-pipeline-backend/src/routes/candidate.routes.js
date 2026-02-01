const express = require('express');
const router = express.Router();
const { addCandidate, getCandidates, updateCandidate, deleteCandidate } = require('../controllers/candidate.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', verifyToken, getCandidates);
router.post('/', verifyToken, upload.single('resume'), addCandidate);
router.put('/:id', verifyToken, updateCandidate);
router.delete('/:id', verifyToken, deleteCandidate);

module.exports = router;
