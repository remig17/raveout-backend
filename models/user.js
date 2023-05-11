const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    token: String,
    styles_musicaux: [String],
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tickets' }]
  });
  
  const User = mongoose.model('users', userSchema);

  module.exports = User;
   