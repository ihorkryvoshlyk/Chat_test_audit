const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isOnline: {
      type: String,
      required: true,
      default: "N"
    },
    socketId: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('users', UserSchema);
