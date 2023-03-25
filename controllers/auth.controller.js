const User = require("../models/User");
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
        email: "Email is used already. Please use another"
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
      error : true,
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
    const {email, password} = req.body;

    const user = await User.findOne({
      email
    });

    if(!user) {
      return res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        error : true,
        message : CONSTANTS.USER_LOGIN_FAILED
      });
    }

    if(passwordHash.compareHash(password, user.password)) {
      user.isOnline = "Y";
      await user.save();
      return res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error : false,
        userId : user._id,
        message : CONSTANTS.USER_LOGIN_OK
      });
    }

    res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
      error : true,
      message : "incorrect password"// CONSTANTS.USER_LOGIN_FAILED
    });

  } catch (error) {
    res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
      error : true,
      message : CONSTANTS.USER_LOGIN_FAILED
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
        error: true,
        message: CONSTANTS.USER_NOT_FOUND 
      })
    }

    if(user.isOnline === "N") {
      return res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.USER_NOT_LOGGED_IN
      })
    }

    return res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      error: true,
      message: CONSTANTS.USER_LOGIN_OK
    })
    
  } catch (error) {
    res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
      error : true,
      message : CONSTANTS.USER_NOT_FOUND
    });
  }
}