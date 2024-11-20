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
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");

// Route imports
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const instituteRoutes = require("./routes/institute");
const userRoutes = require("./routes/user");
const feedRoutes = require("./routes/feeds");
const mcqRoutes = require("./routes/mcq");
const githubRoutes = require("./routes/github");
const scheduleRoutes = require("./routes/schedule");
const attendanceRoutes = require("./routes/attendance");
const questionsRoutes = require("./routes/questions");

// Initialize express app
const app = express();

console.log("Application initialized");

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*",
  optionsSuccessStatus: 200,
};

console.log("CORS options set:", corsOptions);

// Set strictQuery option for Mongoose
mongoose.set("strictQuery", true);

console.log("Mongoose strictQuery set to true");

// Add this line before setting up the rate limiter
app.set("trust proxy", 1);
console.log("checking");

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
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
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

console.log("Express session configured");

// Serve Swagger UI assets only in development
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(
    "/swagger-ui",
    express.static(path.join(__dirname, "node_modules/swagger-ui-dist"))
  );
  console.log("Swagger UI set up for development environment");
}

// Logging middleware
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
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
app.use("/api/schedule", scheduleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", questionsRoutes);
console.log("All routes middleware applied");

// Modify the database connection logic
const mongoURI = process.env.DB_URL;

if (!mongoURI) {
  console.error("Missing DB_URL in environment variables");
  process.exit(1);
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout
      socketTimeoutMS: 45000,
    });
    console.log("Successfully connected to Database");
    return true;
  } catch (error) {
    console.error("Error connecting to Database:", error);
    return false;
  }
};

const startServer = async () => {
  let retries = 5;
  while (retries) {
    const isConnected = await connectToDatabase();
    if (isConnected) {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
      return;
    }
    console.log(`Retrying database connection... (${retries} attempts left)`);
    retries -= 1;
    // Wait for 5 seconds before retrying
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  console.error(
    "Failed to connect to the database after multiple attempts. Exiting..."
  );
  process.exit(1);
};

startServer();

// Modify the error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err.name === "MongooseServerSelectionError") {
    return res.status(503).json({
      error: {
        message: "Database connection error. Please try again later.",
      },
    });
  }
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
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

// For Vercel deployment
module.exports = app;

console.log("App exported for Vercel deployment");
