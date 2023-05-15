const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  pseudo: String,
  email: String,
  token: String,
  password: String,
  avatar: String,
  ville: String,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tags" }],
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tickets" }],
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
