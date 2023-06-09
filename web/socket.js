/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/


'use strict';

const socketController = require("../controllers/socket.controller")
const CONSTANTS = require('../config/constants');

class Socket{

	constructor(socket){
		this.io = socket;
	}
	
	socketEvents(){

		this.io.on('connection', (socket) => {

			/* Get the user's Chat list	*/
			socket.on(`chat-list`, async (data) => {
				if (data.userId == '') {
					this.io.emit(`chat-list-response`, {
						error : true,
						message : CONSTANTS.USER_NOT_FOUND
					});
				}else{
					try {
						const [UserInfoResponse, userlistResponse] = await Promise.all([
							socketController.getUserInfo( {
								userId: data.userId,
								socketId: false
							}),
							socketController.getUserList( data.userId )
							]);
						this.io.to(socket.id).emit(`chat-list-response`, {
							error : false,
							singleUser : false,
							chatList : userlistResponse
						});
						socket.broadcast.emit(`chat-list-response`,{
							error : false,
							singleUser : true,
							chatList : UserInfoResponse
						});
					} catch ( error ) {
						console.log(error)
						this.io.to(socket.id).emit(`chat-list-response`,{
							error : true ,
							chatList : []
						});
					}
				}
			});

			/**
			* send the messages to the user
			*/
			socket.on(`add-message`, async (data) => {
				if (!data.message) {
					this.io.to(socket.id).emit(`add-message-response`,{
						error : true,
						message: CONSTANTS.MESSAGE_NOT_FOUND
					}); 
				}else if(!data.from){
					this.io.to(socket.id).emit(`add-message-response`,{
						error : true,
						message: CONSTANTS.SERVER_ERROR_MESSAGE
					}); 
				}else if(!data.to){
					this.io.to(socket.id).emit(`add-message-response`,{
						error : true,
						message: CONSTANTS.SELECT_USER
					}); 
				}else{
					try{
						const [toSocketId, messageResult ] = await Promise.all([
							socketController.getUserInfo({
								userId: data.to,
								socketId: true
							}),
							socketController.insertMessages(data)						
						]);
						this.io.to(toSocketId).emit(`add-message-response`,data); 
					} catch (error) {
						this.io.to(socket.id).emit(`add-message-response`,{
							error : true,
							message : CONSTANTS.MESSAGE_STORE_ERROR
						}); 
					}
				}				
			});

			socket.on(`typing-message`, async(data) => {
				if(!data.from){
					this.io.to(socket.id).emit(`typing-message-response`,{
						error : true,
						message: CONSTANTS.SERVER_ERROR_MESSAGE
					}); 
				}else if(!data.to){
					this.io.to(socket.id).emit(`typing-message-response`,{
						error : true,
						message: CONSTANTS.SELECT_USER
					}); 
				}else{
					try {
						const toSocketId = await socketController.getUserInfo({
							userId: data.to,
							socketId: true
						})
						this.io.to(toSocketId).emit(`typing-message-response`, {
							from: data.from,
							isTyping: data.isTyping
						}); 
					} catch (error) {
						this.io.to(socket.id).emit(`typing-message-response`,{
							error : true,
							message : CONSTANTS.MESSAGE_STORE_ERROR
						}); 
					}
					
				}
			})


			/**
			* Logout the user
			*/
			socket.on('logout', async (data)=>{
				try{
					const userId = data.userId;
					await socketController.logout(userId);
					this.io.to(socket.id).emit(`logout-response`,{
						error : false,
						message: CONSTANTS.USER_LOGGED_OUT,
						userId: userId
					});

					socket.broadcast.emit(`chat-list-response`,{
						error : false ,
						userDisconnected : true ,
						userid : userId
					});
				} catch (error) {
					console.log(error);
					this.io.to(socket.id).emit(`logout-response`,{
						error : true,
						message: CONSTANTS.SERVER_ERROR_MESSAGE,
						userId: userId
					});
				}
			});

		});

	}
	
	socketConfig(){
		this.io.use( async (socket, next) => {
			try {
				await socketController.addSocketId({
					userId: socket.request._query['userId'],
					socketId: socket.id
				});
				next();
			} catch (error) {
				console.error(error);
			}
		});

		this.socketEvents();
	}
}
module.exports = Socket;