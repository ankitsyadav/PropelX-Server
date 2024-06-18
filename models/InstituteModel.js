const mongoose = require("mongoose");

const InstituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  instituteId: {
    type: String,
    required: true,
  },
});

///we can define functions heat6

module.exports = mongoose.model("Institute", InstituteSchema);
