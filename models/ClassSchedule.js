// models/ClassSchedule.js

const mongoose = require("mongoose");

const classScheduleSchema = new mongoose.Schema({
  batch: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ClassSchedule", classScheduleSchema);
