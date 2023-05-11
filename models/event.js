const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    lieu: String,
    date: Date,
    heure: String,
    photo: String,
    organisateur: String,
    tags: [String],
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tickets' }]
  });
  
  const Event = mongoose.model('events', eventSchema);

  module.exports = Event;
  