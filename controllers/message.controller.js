const Message = require("../models/Message");
const CONSTANTS = require("../config/constants");

exports.getMessage = async (req,res) => {
  const { userId, toUserId} = req.body;
  const data = {
    '$or' : [
      { '$and': [
        {
          'to': userId
        },{
          'from': toUserId
        }
      ]
    },{
      '$and': [ 
        {
          'to': toUserId
        }, {
          'from': userId
        }
      ]
    },
  ]
};

  try {
    const messages = await Message.find(data).sort({timestamp: 1});
    res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({messages})
  } catch (error) {
    res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
      error: true,
      messages: []
    })
  }
}