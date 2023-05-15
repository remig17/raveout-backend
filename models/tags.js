const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  tags: [String],
});

const Tag = mongoose.model("tags", tagSchema);

module.exports = Tag;
