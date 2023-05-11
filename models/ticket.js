const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    id_evenement: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
    prix: Number,
    date_debut_vente: Date,
    date_fin_vente: Date,
    quantite_disponible: Number,
  });
  
  const Ticket = mongoose.model('tickets', ticketSchema);

  module.exports = Ticket;
  