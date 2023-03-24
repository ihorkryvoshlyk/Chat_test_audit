/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

'use strict';

const authRoute = require("../routes/auth.route");
const messageRoute = require("../routes/message.route");

class Routes{

	constructor(app){
		this.app = app;
	}

	/* creating app Routes starts */
	appRoutes(){
		this.app.use("/api/auth", authRoute);
		this.app.use("/api/message", messageRoute);
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;