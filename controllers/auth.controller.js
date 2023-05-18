/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

const User = require("../models/user");
const Token = require("../models/Token");
const CONSTANTS = require("../config/constants");
const passwordHash = require("../utils/password-hash")
const { validationResult } = require('express-validator');

exports.signup = async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CONSTANTS.SERVER_BAD_REQUEST_CODE).json({ errors: errors.array() });
  }

  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email
    });

    if(user) {
      return res.status(CONSTANTS.SERVER_BAD_REQUEST_CODE).json({
        email: CONSTANTS.EMAIL_ALREADY_EXIST
      })
    }


    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash.createHash(password)
    });

    res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json(newUser)
  } catch (error) {
      res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
      message : CONSTANTS.SERVER_ERROR_MESSAGE
    });
  }
}

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CONSTANTS.SERVER_BAD_REQUEST_CODE).json({ errors: errors.array() });
  }

  try {
    const {userId, token} = req.body;

    const userToken = await Token.findOne({
      userId
    });

    if(!userToken) {
      return res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        redirectUrl : "https://domain.com/signin"
      });
    }

    if(userToken.token === token) {
      user.isOnline = "Y";
      await user.save();
      return res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error : false,
        userId : user._id,
        message : CONSTANTS.USER_LOGIN_OK
      });
    }

    res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        redirectUrl : "https://domain.com/signin"
    });

  } catch (error) {
    res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        redirectUrl : "https://domain.com/signin"
    });
  }
}

exports.userSessionCheck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CONSTANTS.SERVER_BAD_REQUEST_CODE).json({ errors: errors.array() });
  }

  try {
    const {userId} = req.body;
  
    const user = await User.findOne({
      _id: userId
    });

    if(!user) {
      return res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        message: CONSTANTS.USER_NOT_FOUND 
      })
    }

    if(user.isOnline === "N") {
      return res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        message: CONSTANTS.USER_NOT_LOGGED_IN
      })
    }

    return res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      message: CONSTANTS.USER_LOGIN_OK
    })
    
  } catch (error) {
    res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
      message : CONSTANTS.USER_NOT_FOUND
    });
  }
}

exports.userInfo = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isOnline: user.isOnline,
      socketId: user.socketId
    });  
  } catch (error) {
    res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
      message : CONSTANTS.USER_NOT_FOUND
    });
  }
  
}