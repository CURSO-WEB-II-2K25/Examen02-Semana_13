const mongoose = require("mongoose");

const schUsers = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  schoolGrade: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: Buffer, required: true },
  mime: { type: String, required: true },
});

const Users = mongoose.model("Users", schUsers);
module.exports = Users;