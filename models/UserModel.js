const mongoose = require("mongoose");

const socialMediaLinksSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const skillsSchema = new mongoose.Schema({
  skill_name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  cover_image: {
    type: String,
    default: "https://i.postimg.cc/mgWFQR8p/5ffhts.jpg",
  },
  tools_n_tech: {
    type: [String],
    default: [],
  },
});

// Define Attendance Schema
const attendanceSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  present: {
    type: Boolean,
    default: true, // Default to true if not specified
  },
});

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  phone: {
    type: String,
    required: false,
  },
  studentId: {
    type: String,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profileImageUrl: {
    type: String,
    default: "https://i.postimg.cc/YSxTzMhH/istockphoto-2010149116-1024x1024.jpg",
  },
  skills: {
    type: [skillsSchema],
    default: [],
  },
  projects: {
    type: [ProjectSchema],
    default: [],
  },
  socialMediaLinks: {
    type: [socialMediaLinksSchema],
  },
  type: {
    type: String,
    enum: ["student"],
    default: "student",
  },
  present: {
    type: Boolean,
    default: true, // Default value is true for presence
  },
  attendance: [attendanceSchema], // Add attendance field to store records for each class
});

module.exports = mongoose.model("User", User);
