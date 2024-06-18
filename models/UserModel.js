const { type } = require("@hapi/joi/lib/extend");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
  phoneNo: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profileImageUrl: {
    type: String,
    default: "https://i.postimg.cc/mgWFQR8p/5ffhts.jpg",
  }
, skills: {
  type: [String], 
  default: [], 
},



});


///we can define functions heat6


module.exports = mongoose.model("User", UserSchema);
