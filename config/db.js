	/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/
 
"use strict";
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);


const connectDB = async () => {
const dbUrl = process.env.MODE === "development" ? process.env.DB_URL_DEV : process.env.DB_URL;
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.log("db connection failure.")
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
