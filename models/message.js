const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    task: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "tasks"
    },
    from: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users"
    },
    to: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('messages', MessageSchema);
