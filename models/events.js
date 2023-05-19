const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: String,
  lieu: String,
  date_debut: Date,
  date_fin: Date,
  photo: String,
  description: String,
  organisateur: String,
  longitude: Number,
  latitude: Number,
  adresse: String,
  tags: [String],
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tickets" }],
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
