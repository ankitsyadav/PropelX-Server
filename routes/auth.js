const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validations.js");
const User = require("../models/UserModel");

// Logging middleware
router.use((req, res, next) => {
  console.log('Auth Route - Request Body:', req.body);
  next();
});

// POST /register
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 example: yourpassword
 *               studentId:
 *                 type: string
 *                 example: stu12345
 *               phoneNo:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   example: 60c72b2f5f1b2c6f5e2d5b6c
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);

    const { error } = registerValidation(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const emailExists = await User.findOne({ email: req.body.email }).lean().maxTimeMS(30000);
    if (emailExists) {
      console.log('Email already exists:', req.body.email);
      return res.status(400).json({ error: "Email address already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      studentId: req.body.studentId,
      phoneNo: req.body.phoneNo,
    });

    const newUser = await user.save({ timeout: 30000 });
    console.log('User registered successfully:', newUser._id);
    res.status(201).json({ user: newUser._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: "Registration failed. Please try again later." });
  }
});

// POST /login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         headers:
 *           auth-token:
 *             schema:
 *               type: string
 *               example: your_jwt_token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: your_jwt_token
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Email or Password do not match
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);

    // Validation check
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Email existence check
    const registeredUser = await User.findOne({ email: req.body.email }).maxTimeMS(30000);
    if (!registeredUser)
      return res.status(400).json({ error: "User with this email does not exist" });

    // Check password
    const passwordMatch = bcrypt.compareSync(
      req.body.password,
      registeredUser.password
    );
    if (!passwordMatch)
      return res.status(400).json({ error: "Email or Password do not match" });

    // Create and assign JWT
    const token = jwt.sign({ _id: registeredUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', registeredUser._id);
    res.header("auth-token", token).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
});

module.exports = router;
