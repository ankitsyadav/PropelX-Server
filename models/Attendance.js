const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  college: { type: String, required: true },
  batch: { type: String, required: true },
  className: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  students: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      present: { type: Boolean, default: true },
    },
  ],
  markedBy: { type: String, required: true },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
