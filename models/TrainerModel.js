// generate a trainer model with additional fields for scheduling trainings and tracking attendance
const mongoose = require("mongoose");

const TrainingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  institute: {
    type: String,
    required: true,
  },
  students: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    attendance: {
      type: Boolean,
      default: true,
    },
  }],
});

const TrainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["trainer", "admin"], // Enum for role
    default: "trainer", // Default role is trainer
  },
  trainings: [TrainingSchema],
});

module.exports = mongoose.model("Trainer", TrainerSchema);
