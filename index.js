const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./config/logger");
const errorHandler = require("./middlewares/errorHandler");
const { swaggerUi, swaggerSpec } = require("./config/swagger");
const path = require("path");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const bodyParser = require('body-parser');

// Route imports
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const instituteRoutes = require("./routes/institute");
const userRoutes = require("./routes/user");
const feedRoutes = require("./routes/feeds");
const mcqRoutes = require("./routes/mcq");
const githubRoutes = require("./routes/github");

// Initialize express app
const app = express();

console.log("Application initialized");

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : "*",
  optionsSuccessStatus: 200,
};

console.log("CORS options set:", corsOptions);

// Set strictQuery option for Mongoose
mongoose.set("strictQuery", true);

console.log("Mongoose strictQuery set to true");

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after an hour",
  handler: (req, res) => {
    console.log("Rate limit exceeded for IP:", req.ip);
    res.status(429).json({ error: "Too many requests, please try again later" });
  },
});

console.log("Rate limiter configured");

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

console.log("Middlewares applied: cors, express.json, rate limiter");

// Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

console.log("Express session configured");

// Serve Swagger UI assets only in development
if (process.env.NODE_ENV !== 'production') {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(
    "/swagger-ui",
    express.static(path.join(__dirname, "node_modules/swagger-ui-dist"))
  );
  console.log("Swagger UI set up for development environment");
}

// Add this just before your route middlewares
app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  next();
});

// Route Middlewares
app.use("/", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/uploads", express.static("uploads"));
app.use("/api/institute", instituteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feeds", feedRoutes);
app.use("/api/skills", mcqRoutes);
app.use("/api/auth/github", githubRoutes);

console.log("All routes middleware applied");

// Connect to Database
const mongoURI = process.env.DB_URL;

if (!mongoURI) {
  console.error("Missing DB_URL in environment variables");
  throw new Error("Missing DB_URL in environment variables");
}

console.log("Attempting to connect to database...");

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  })
  .then(() => {
    console.log("Successfully connected to Database");
  })
  .catch((error) => {
    console.error("Error connecting to Database:", error);
    // Don't exit the process, let the application continue
    console.log("Application will continue without database connection");
  });

// Modify your error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    },
  });
});

console.log("Error handling middleware applied");

// Default Route Handler for undefined routes
app.use((req, res) => {
  console.log("404 error: Page not found for URL:", req.url);
  res.status(404).send("404: Page not found");
});

console.log("Default 404 route handler set up");

// Start the server
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  console.log("Production environment detected, exporting app for Vercel");
}

// Logging middleware for all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  next();
});

console.log("Request logging middleware applied");

// For Vercel deployment
module.exports = app;

console.log("App exported for Vercel deployment");
