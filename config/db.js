	/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/
 
"use strict";
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://admin:ki9466pVoALousEu@SG-snow-chair-52-57462.servers.mongodirector.com:27017/admin", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
