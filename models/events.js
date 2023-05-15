const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: String,
  token: String,
  lieu: String,
  date_debut: String,
  date_fin: String,
  photo: String,
  organisateur: String,
  Longitude: Number,
  Latitude: Number,
  tags: [String],
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tickets" }],
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
