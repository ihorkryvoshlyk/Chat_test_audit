const User = require("../models/User")
const Message = require("../models/Message")

exports.getUserInfo = async (userId, socketId = false) => {
  let queryProjection = null;
  if (socketId) {
    queryProjection = {
      "socketId" : true
    }
  } else {
    queryProjection = {
      "firstName": true,
      "lastName": true,
      "email" : true,
      "isOnline" : true,
      '_id': false,
      'id': '$_id'
    }
  }
  try {
    const user = await User.aggregate([
      { $match: { _id: userId } },
      { $project: queryProjection }
    ]);
    return socketId ? user[0].socketId : user;
  } catch (error) {
    throw new Error(error);
  }
}

exports.addSocketId = async ({userId, socketId}) => {
  const filter = { _id: userId };
  const update = { 
    $set: {
      socketId: socketId,
      online: 'Y'
    }
  };

  try {
    const result = await User.updateOne(filter, update);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.getChatList = async (userId) => {
  try {
    const users  = User.find({
      "_id": {
        $ne: userId
      }
    }).select(["-password", "-socketId"])
    return users
  } catch (error) {
    throw new Error(error);
  }
}

exports.insertMessages = async (messagePacket) => {
  try {
    const newMessage = new Message(messagePacket);
    await newMessage.save()
    return newMessage;
  } catch (error) {
    throw new Error(error.message);
  }
}; 	

exports.getMessages = async ({taskId, userId, toUserId}) => {
  const data = {
    '$or' : [
      { '$and': [
        {
          'to': userId
        },{
          'from': toUserId
        },
        {
          'task': taskId
        }
      ]
    },{
      '$and': [ 
        {
          'to': toUserId
        }, {
          'from': userId
        },
        {
          'task': taskId
        }
      ]
    },
  ]
};

  try {
    const messages = await Message.find(data).sort({timestamp: 1});
    return messages;
  } catch (error) {
    throw new Error(error.message);
  }
};



