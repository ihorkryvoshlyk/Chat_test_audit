/*
* Real time private chatting app using React, Nodejs, mongodb and Socket.io
* @author Ihor Kryvoshlyk
*/

/* Validation related  constants starts*/
module.exports.FIRSTNAME_REQUIRED = `First name must be required.`;
module.exports.LASTNAME_REQUIRED = `Last name must be required.`;
module.exports.EMAIL_REQUIRED = `Email address must be required.`;
module.exports.EMAIL_INVALID = `Email address is invalid.`;
module.exports.EMAIL_ALREADY_EXIST = `Email is used already. Please use another`;
module.exports.USERNAME_REQUIRED = `Username must be required.`;
module.exports.PASSWORD_REQUIRED = `Password must be required.`;
module.exports.PASSWORD_LENGTH = `Please enter a password with 6 or more characters`;
module.exports.PASSWORD_INCORRECT = `Password is incorrect.`
module.exports.USERID_REQUIRED = `User Id must be required.`;
module.exports.USER_NOT_FOUND = `User does not exits.`;
module.exports.MESSAGE_NOT_FOUND = `Message can't be empty.`;
module.exports.SELECT_USER = `Select a user to chat.`;
/* Validation related  constants ends*/

/* General Errors  constants start */
module.exports.MESSAGE_STORE_ERROR =`Could not store messages, server error.`;
module.exports.ROUTE_NOT_FOUND = `You are at wrong place. Shhoooo...`;
module.exports.SERVER_ERROR_MESSAGE = `Something bad happend. It's not you, it's me.`;

/* HTTP status code constant starts */
module.exports.SERVER_ERROR_HTTP_CODE = 412;
module.exports.SERVER_NOT_ALLOWED_HTTP_CODE = 503;
module.exports.SERVER_OK_HTTP_CODE = 200;
module.exports.SERVER_NOT_FOUND_HTTP_CODE = 404;
module.exports.SERVER_BAD_REQUEST_CODE = 400;
module.exports.UNAUTHORIZED = 401;
/* HTTP status codeconstant ends */

/* Route related constants starts*/
module.exports.USERNAME_AVAILABLE_FAILED = `Username is unavailable.`;
module.exports.USERNAME_AVAILABLE_OK = `Username is available.`;
module.exports.USER_REGISTRATION_OK = `User registration successful.`;
module.exports.USER_REGISTRATION_FAILED = `User registration unsuccessful.`;
module.exports.USER_LOGIN_OK = `User logged in.`;
module.exports.USER_LOGIN_FAILED = `User not found.`;
module.exports.USER_NOT_LOGGED_IN = `User is not logged in.`;
module.exports.USER_LOGGED_OUT = `User is not logged in.`;
/* Route related constants ends*/
