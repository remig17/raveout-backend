const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    lieu: String,
    date_debut: Date,
    hdate_fin: Date,
    photo: String,
    organisateur: String,
    Longitude: Number,
    Latitude: Number,
    tags: [String],
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tickets' }]
  });
  
  const Event = mongoose.model('events', eventSchema);

  module.exports = Event;
  