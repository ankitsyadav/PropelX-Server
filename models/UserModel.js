const { type } = require("@hapi/joi/lib/extend");
const mongoose = require("mongoose");

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
  cover_image:{
    type: String,
    
    default: "https://i.postimg.cc/mgWFQR8p/5ffhts.jpg",
  },
  tools_n_tech:{
    type: [String], 
  default: [], 
  },

});



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
  type: [skillsSchema], 
  default: [], 
},

projects: {
  type: [ProjectSchema],
  default: [],
},



});


///we can define functions heat6


module.exports = mongoose.model("User", UserSchema);
