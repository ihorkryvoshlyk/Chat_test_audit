/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    message: {
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
