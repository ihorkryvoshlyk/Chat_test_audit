/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

'use strict';

const authRoute = require("../routes/auth.route");

class Routes{

	constructor(app){
		this.app = app;
	}

	/* creating app Routes starts */
	appRoutes(){
		this.app.use("/auth", authRoute);

		// this.app.post('/usernameAvailable', routeHandler.userNameCheckHandler);s

		// this.app.post('/register', routeHandler.registerRouteHandler);

		// this.app.post('/login', routeHandler.loginRouteHandler);

		// this.app.post('/userSessionCheck', routeHandler.userSessionCheckRouteHandler);

		// this.app.post('/getMessages', routeHandler.getMessagesRouteHandler);

		// this.app.get('*', routeHandler.routeNotFoundHandler);		
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;