const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Protecting these routes as per standard practice, but can be adjusted
router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUserById);

module.exports = router;
