const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Route imports
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const instituteRoutes = require("./routes/institute");
const userRoutes = require("./routes/user");
const rateLimit = require('express-rate-limit');

let swaggerUi, swaggerSpec;

if (process.env.NODE_ENV !== 'production') {
  const swagger = require('./swagger');
  swaggerUi = swagger.swaggerUi;
  swaggerSpec = swagger.swaggerSpec;
}

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
app.use('/api/uploads', express.static('uploads'));

// Serve Swagger UI assets only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Route Middlewares
app.use("/", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/users", userRoutes);

// Log Environment Variables
console.log("DB_URL:", process.env.DB_URL);
console.log("PORT:", process.env.PORT);

// Connect to Database
const mongoURI = process.env.DB_URL;

if (!mongoURI) {
  throw new Error("Missing DB_URL in environment variables");
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.error("Error connecting to Database:", error);
  });

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Application running at http://localhost:${port}/`);
});
