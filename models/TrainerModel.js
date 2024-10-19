// generate a trainer model
const mongoose = require("mongoose");

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
    default: "trainer",
  },
});

module.exports = mongoose.model("Trainer", TrainerSchema);
