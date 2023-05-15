const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: String,
  token: String,
  lieu: String,
  date_debut: Date,
  date_fin: Date,
  photo: String,
  organisateur: String,
  Longitude: Number,
  Latitude: Number,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tags" }],
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tickets" }],
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
