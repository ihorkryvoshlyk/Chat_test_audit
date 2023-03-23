const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');

const CONSTANTS = require('./../config/constants');
const authController = require("../controllers/auth.controller")
const passwordHash = require('./../utils/password-hash');

router.post('/signup',
  check('username', CONSTANTS.USERNAME_REQUIRED).notEmpty(),
  check('passowrd', CONSTANTS.PASSWORD_REQUIRED).notEmpty(),
  check(
    'password',
    CONSTANTS.PASSWORD_LENGTH
  ).isLength({ min: 6 }),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const data = {
    username : (req.body.username).toLowerCase(),
    password : req.body.password
  };
  
  try {
    data.online = 'Y' ;
    data.socketId = '' ;
    data.password = passwordHash.createHash(data.password);
    const result = await authController.registerUser(data);
    if (result === null || result === undefined) {
      return res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error : false,
        message : CONSTANTS.USER_REGISTRATION_FAILED
      });	           			
    } 
      res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error : false,
        userId : result.insertedId,
        message : CONSTANTS.USER_REGISTRATION_OK
      });
  } catch ( error ) {
    res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
      error : true,
      message : CONSTANTS.SERVER_ERROR_MESSAGE
    });
  }
});

router.post('/login',
check('username', CONSTANTS.USERNAME_REQUIRED).notEmpty(),
check('passowrd', CONSTANTS.PASSWORD_REQUIRED).notEmpty(),
check(
  'password',
  CONSTANTS.PASSWORD_LENGTH
).isLength({ min: 6 }),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const data = {
    username : (req.body.username).toLowerCase(),
    password : req.body.password
  };
  
  try {
    const result = await authController.getUserByUsername(data.username);
    if(result ===  null || result === undefined) {
      return res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        error : true,
        message : CONSTANTS.USER_LOGIN_FAILED
      });
    }
    if( passwordHash.compareHash(data.password, result.password)) {
      await authController.makeUserOnline(result._id);
      return res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error : false,
        userId : result._id,
        message : CONSTANTS.USER_LOGIN_OK
      });
    }
    res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
      error : true,
      message : CONSTANTS.USER_LOGIN_FAILED
    });
  } catch (error) {
    res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
      error : true,
      message : CONSTANTS.USER_LOGIN_FAILED
    });
  }
});

router.post('/userSessionCheck',
check("userId", CONSTANTS.USERID_NOT_FOUND),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let userId = req.body.userId;
  
  try {
    const result = await authController.userSessionCheck({ userId : userId });
    res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      error : false,
      username : result.username,
      message : CONSTANTS.USER_LOGIN_OK
    });
  } catch(error) {
    res.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
      error : true,
      message : CONSTANTS.USER_NOT_LOGGED_IN
    });
  }
});

module.exports = router;