const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// GitHub OAuth Routes
router.get('/github', authController.githubAuth);
router.get('/github/callback', authController.githubCallback);

// Optimize by chaining route definitions
router
  .get('/github', authController.githubAuth)
  .get('/github/callback', authController.githubCallback);

module.exports = router;