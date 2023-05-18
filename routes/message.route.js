/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller")

router.post('/getMessages',
messageController.getMessage);

module.exports = router
