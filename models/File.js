const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: String,
  path: String,
  size: Number,
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder'
  }
});

module.exports = mongoose.model('File', FileSchema);
