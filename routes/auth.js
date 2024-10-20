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
router.post("/register", async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);

    const { error } = registerValidation(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const emailExists = await User.findOne({ email: req.body.email }).lean();
    if (emailExists) {
      console.log('Email already exists:', req.body.email);
      return res.status(400).json({ error: "Email address already exists" });
    }

    // Check if studentId already exists
    const existingUser = await User.findOne({ studentId: req.body.studentId });
    if (existingUser) {
      return res.status(400).json({ message: `Student ID already exists: ${req.body.studentId}` });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userType = req.body.userType; 
    const newUser = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      studentId: req.body.studentId,
      trainerId:req.body.trainerId,
      phoneNo: req.body.phoneNo,
      type: userType, 
    });

    console.log('User registered successfully:', newUser._id);
    res.status(201).json({ user: newUser._id });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'MongooseServerSelectionError') {
      return res.status(503).json({ error: "Database connection error. Please try again later." });
    }
    res.status(500).json({ error: "Registration failed. Please try again later." });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const registeredUser = await User.findOne({ email: req.body.email });
    if (!registeredUser) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, registeredUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: registeredUser._id,type:registeredUser.type }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', registeredUser._id);
    res.header("auth-token", token).json({ token,userType: registeredUser.type  });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
});

module.exports = router;
