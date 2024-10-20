const jwt = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const authenticateUser = (req, res, next) => {
  const token = req.header("auth-token"); // Retrieve the token from request headers

  // Check if token is missing
  if (!token) {
    console.log("No token found");
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    // Verify the token with the provided JWT_SECRET
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the verified user payload to the request object
    req.user = verified;

    // Call next middleware function
    next();
  } catch (error) {
    console.error("Invalid token:", error.message);
    return res.status(400).send("Invalid token.");
  }
};

module.exports = authenticateUser;
