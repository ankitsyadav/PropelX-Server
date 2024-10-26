const mongoose = require("mongoose");

const InstituteSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    required: true,
  },
  instituteLocation: {
    type: String,
    required: true,
  },
  students: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
  }],
  trainings: [{
    trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainings',
      required: true,
    },
  }],
});

module.exports = mongoose.model("Institute", InstituteSchema);
