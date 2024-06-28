const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validations.js');
const User = require('../models/UserModel');


// Routers
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
 *       200:
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
 *               type: string
 *               example: Email address already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', async (req, res) => {


    // Validation check
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Email uniqueness check
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email address already exists');

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Save user
    const user = User({
       email: req.body.email,
       name: req.body.name,
       password: hashedPassword,
       studentId: req.body.studentId,
       phoneNo: req.body.phoneNo,
    });

    try {
        const newUser = await user.save()
        res.send({user: newUser._id});
    } catch (error) {
        res.send({"message": error.message})
    }
})


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
router.post('/login', async (req, res) => {

    // Validation check
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Email existance check
    const registeredUser = await User.findOne({email: req.body.email});
    if(!registeredUser) return res.status(400).send('User with this email does not exist');

    // Check password
    const passwordMatch = bcrypt.compareSync(req.body.password, registeredUser.password);
    if(!passwordMatch) return res.status(400).send('Email or Password do not match');

    // Create and assign JWT
    const token = jwt.sign({_id: registeredUser._id}, process.env.JWT_SECRET);
    console.log(typeof(token) );
    res.header('auth-token', token).send(token);
})



module.exports = router