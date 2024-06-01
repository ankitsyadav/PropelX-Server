const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.header('auth-token'); // For any authenticated request, need to pass auth-token header
    if (!token) {
        console.log('No token found');
        return res.status(401).send('Access denied');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // Move next() inside the try block
    } catch (error) {
        console.log('Invalid token:', error);
        return res.status(400).send({ message: 'Invalid token' });
    }
}

module.exports = authenticateUser;
