const router = require('express').Router();
const User = require('../models/UserModel');
const authenticateUser = require('./verifyToken.js');
const { updateProfileImage } = require('../controllers/userController');

// POST /register and POST /login routes remain unchanged

// PUT /me/skills to update user skills
/**
 * @swagger
 * /skills:
 *   put:
 *     summary: Update user skills
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Skills updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/skills', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
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
});

// PUT /:id/profile-image to update profile image
router.put('/:id/profile-image', authenticateUser, updateProfileImage);

// POST /projects to add a new project
router.post('/projects', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const newProject = req.body.project; // Assuming req.body.project is a project object
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Add new project
    user.projects.push(newProject);
    await user.save();

    res.status(200).send('Project added successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// PUT /projects/:projectId to update an existing project
router.put('/projects/:projectId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.projectId;
    const updatedProject = req.body.project; // Assuming req.body.project is a project object with updated details

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Find the project to update
    const projectIndex = user.projects.findIndex(project => project._id.toString() === projectId);
    if (projectIndex === -1) return res.status(404).send('Project not found');

    // Update project details
    user.projects[projectIndex] = { ...user.projects[projectIndex]._doc, ...updatedProject };
    await user.save();

    res.status(200).send('Project updated successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

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
