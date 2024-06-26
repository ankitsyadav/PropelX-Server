const dotenv = require("dotenv");
dotenv.config();
const { swaggerUi, swaggerSpec } = require('./swagger');

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Route imports
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const instituteRoutes = require("./routes/institute");
const userRoutes = require("./routes/user");

const limiter = require("./middlewares/rateLimiter");

// Initialize express app
const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);
app.use('/api/uploads', express.static('uploads'));

// Serve Swagger UI assets
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
