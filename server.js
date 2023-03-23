/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');

const socketEvents = require('./web/socket'); 
const routes = require('./web/routes'); 
const appConfig = require('./config/app-config');
const db = require("./config/db");


class Server{

    constructor(){
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
    }

    connectDB() {
        db();
    }

    appConfig(){        
        new appConfig(this.app).includeConfig();
    }

    /* Including app Routes starts*/
    includeRoutes(){
        new routes(this.app).routesConfig();
        new socketEvents(this.socket).socketConfig();
    }
    /* Including app Routes ends*/  

    appExecute(){
        this.connectDB();
        this.appConfig();
        this.includeRoutes();

        const port =  process.env.PORT || 4000;
        const host = process.env.HOST || `localhost`;      

        this.http.listen(port, host, () => {
            console.log(`Listening on http://${host}:${port}`);
        });
    }

}
    
const app = new Server();
app.appExecute();