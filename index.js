const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require('./config/logger');
const errorHandler = require('./middlewares/errorHandler');
const { swaggerUi, swaggerSpec } = require('./config/swagger');
const path = require('path');

// Route imports
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const instituteRoutes = require("./routes/institute");
const userRoutes = require("./routes/user");
const rateLimit = require('express-rate-limit');
// const userAgentCheck = require('./middlewares/checkUserAgent');

// Initialize express app
const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.set('trust proxy', true);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);

// Serve Swagger UI assets
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/swagger-ui', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist'))); // Serve static files

// Route Middlewares
app.use("/", homeRoutes);
// app.use(userAgentCheck);

app.use("/api/auth", authRoutes);
app.use('/api/uploads', express.static('uploads'));
app.use("/api/institute", instituteRoutes);
app.use("/api/users", userRoutes);

// Log Environment Variables
logger.info(`DB_URL: ${process.env.DB_URL}`);
logger.info(`PORT: ${process.env.PORT}`);

// Connect to Database
const mongoURI = process.env.DB_URL;

if (!mongoURI) {
  logger.error("Missing DB_URL in environment variables");
  throw new Error("Missing DB_URL in environment variables");
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to Database");
  })
  .catch((error) => {
    logger.error("Error connecting to Database:", error);
    process.exit(1); // Ensure process exits on database connection failure
  });

// Error Handling Middleware
app.use(errorHandler);

// Default Route Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).send('404: Page not found');
});

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Application running at http://localhost:${port}/`);
});
