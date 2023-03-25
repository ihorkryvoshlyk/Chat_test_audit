/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

'use strict';

const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const cors = require("cors")
const path = require("path");

const socketEvents = require('./web/socket'); 
const routes = require('./web/routes'); 
const appConfig = require('./config/app-config');
const db = require("./config/db");


class Server{

    constructor(){
        this.app = express();
        this.http = http.createServer(this.app);
        this.socket = socketio(this.http, {cors: {origin: "*"}});
        this.app.use(cors());
    }

    appConfig(){        
        new appConfig(this.app).includeConfig();
    }

    connectDB() {
        db();
    }

    /* Including app Routes starts*/
    includeRoutes(){
        new routes(this.app).routesConfig();
        new socketEvents(this.socket).socketConfig();
    }
    /* Including app Routes ends*/  

    appExecute(){
        this.appConfig();
        this.connectDB();
        this.includeRoutes();

        // production
        // this.app.use("*", (req,res) => {
        //     res.sendFile(path.join(__dirname, "./build/index.html"));
        // })
        const port =  process.env.PORT || 4000;
        // const host = process.env.HOST || `localhost`;      

        this.http.listen(port, () => {
            console.log(`Listening on ${port}`);
        });
    }

}
    
const app = new Server();
app.appExecute();