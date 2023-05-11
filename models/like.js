const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'utilisateurs' },
    id_evenement: { type: mongoose.Schema.Types.ObjectId, ref: 'evenements' },
  });
  
  const Like = mongoose.model('likes', likeSchema);
  

  module.exports = Like;
