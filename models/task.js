/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    descrition: {
      type: String
    },
    budget: [
      {
        type: Number,
      }
    ],
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users"
    },
    members: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('tasks', TaskSchema);
