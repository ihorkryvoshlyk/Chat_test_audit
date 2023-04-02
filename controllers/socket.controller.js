const User = require("../models/user")
const Message = require("../models/message")

exports.getUserInfo = async ({userId, socketId = false}) => {
  try {
    const user = await User.findById(userId);
    if(user) {
      if(socketId) {
        return user.socketId;
      }
      return [{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isOnline: user.isOnline,
        socketId: user.socketId,
        _id: user._id
      }];
    }

    if(!user) {
      if(socketId) {
        throw new Error("Can not find user.")
      }
      return [];
    }
     
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
      isOnline: 'Y'
    }
  };

  try {
    const result = await User.updateOne(filter, update);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.getUserList = async (userId) => {
  try {
    const users  = await User.find({
      "_id": {
        $ne: userId
      }
    }).select(["-password", "-socketId"])
    const data = {
      '$or' : [
          {
            'to': userId
          },
          {
            'from': userId
          },
          
        ]
      };

  const messages = await Message.find(data).sort({timestamp: 1});

  const payload = users.map(user => {
    const {firstName, lastName, email, isOnline, _id} = user;
    const lastMessage = messages.filter(message => message.to.toString() === user._id.toString() || message.from.toString() === user._id.toString()).reverse()[0];
    if(lastMessage) {
      return {
        firstName,
        lastName,
        email,
        isOnline,
        lastMessage,
        _id
      }
    }
    return user
  })
  return payload
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

exports.logout = async (userId,isSocketId) => {
  const data = {
    $set :{
      isOnline : 'N'
    }
  };

  try {
    await User.findOneAndUpdate({
      _id: userId
    },
    data
    )  
  } catch (error) {
    console.log(error)
  }
}



