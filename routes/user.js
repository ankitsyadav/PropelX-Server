const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const authenticateUser = require('./verifyToken.js');
const { updateProfileImage } = require('../controllers/userController');


// POST /register and POST /login routes remain unchanged

// PUT /me/skills to update user skills

router.put('/:id/profile-image',authenticateUser , updateProfileImage);

router.put('/skills', authenticateUser, async (req, res) => {
    try {
      const userId = req.user._id; // Get user ID from authenticated token
      const user = await User.findById(userId);
      if (!user) return res.status(404).send('User not found');
  
      // Update user skills
      user.skills = req.body.skills; // Assuming req.body.skills is an array of strings
      await user.save();
  
      res.status(200).send('Skills updated successfully');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });;

// GET /me to get user details
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // Exclude password field from response
    if (!user) return res.status(404).send('User not found');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
