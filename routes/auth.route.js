const express = require("express");
const router = express.Router();
const { check } = require('express-validator');

const CONSTANTS = require('./../config/constants');
const authController = require("../controllers/auth.controller")

router.post('/signup',
  check('firstName', CONSTANTS.FIRSTNAME_REQUIRED).notEmpty(),
  check('lastName', CONSTANTS.LASTNAME_REQUIRED).notEmpty(),
  check('email', CONSTANTS.EMAIL_INVALID).isEmail(),
  check('password', CONSTANTS.PASSWORD_REQUIRED).notEmpty(),
  check(
    'password',
    CONSTANTS.PASSWORD_LENGTH
  ).isLength({ min: 6 }),
  authController.signup);

router.post('/signin',
  check('email', CONSTANTS.EMAIL_INVALID).isEmail(),
  check('password', CONSTANTS.PASSWORD_REQUIRED).notEmpty(),
  check(
  'password',
  CONSTANTS.PASSWORD_LENGTH
).isLength({ min: 6 }), authController.signin)

router.post('/userSessionCheck',
check("userId", CONSTANTS.USERID_NOT_FOUND).notEmpty(),
authController.userSessionCheck)

router.get("/user-info/:userId", authController.userInfo)

module.exports = router;