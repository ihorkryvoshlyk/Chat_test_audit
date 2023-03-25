/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

const express = require("express");
const expressConfig = require('./express-config');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require("path");

class AppConfig{
	
	constructor(app){
		dotenv.config();
		this.app = app;
	}

	includeConfig() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		// this.app.use(express.static(path.join(__dirname, "../build")));

		new expressConfig(this.app);
	}

}
module.exports = AppConfig;
