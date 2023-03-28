const User = require("../models/user")
const Message = require("../models/message")

exports.getUserInfo = async ({userId, socketId = false}) => {
  try {
    const user = await User.findById(userId);
    if(socketId) {
      return user.socketId;
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isOnline: user.isOnline,
      socketId: user.socketId
    }; 
  } catch (error) {
    console.log(error)
    throw new Error(error)
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



