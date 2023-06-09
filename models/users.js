const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  pseudo: String,
  email: String,
  token: String,
  password: String,
  avatar: String,
  ville: String,
  description: String,
  tags: [String],
  // tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tickets" }],
  tickets: [String],
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
