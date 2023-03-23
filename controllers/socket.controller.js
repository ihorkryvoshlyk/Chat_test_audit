const Mongodb = require("./../config/db");

exports.getUserInfo = ({userId,socketId = false}) => {
  let queryProjection = null;
  if(socketId){
    queryProjection = {
      "socketId" : true
    }
  } else {
    queryProjection = {
      "username" : true,
      "online" : true,
      '_id': false,
      'id': '$_id'
    }
  }
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('users').aggregate([{
        $match:  {
          _id : ObjectID(userId)
        }
      },{
        $project : queryProjection
      }
      ]).toArray( (err, result) => {
        DB.close();
        if( err ){
          reject(err);
        }
        socketId ? resolve(result[0]['socketId']) : resolve(result);
      });
    } catch (error) {
      reject(error)
    }
  });
}

exports.addSocketId = ({userId, socketId}) => {
  const data = {
    id : userId,
    value : {
      $set :{
        socketId : socketId,
        online : 'Y'
      }
    }
  };
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('users').update( { _id : ObjectID(data.id)}, data.value ,(err, result) => {
        DB.close();
        if( err ){
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error)
    }
  });
}

exports.getChatList = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('users').aggregate([{
        $match: {
          'socketId': { $ne : userId}
        }
      },{
        $project:{
          "username" : true,
          "online" : true,
          '_id': false,
          'id': '$_id'
        }
      }
      ]).toArray( (err, result) => {
        DB.close();
        if( err ){
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error)
    }
  });
}

exports.insertMessages = (messagePacket) => {
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('messages').insertOne(messagePacket, (err, result) =>{
        DB.close();
        if( err ){
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error)
    }
  });
}

exports.getMessages = ({userId, toUserId}) => {
  const data = {
      '$or' : [
        { '$and': [
          {
            'toUserId': userId
          },{
            'fromUserId': toUserId
          }
        ]
      },{
        '$and': [ 
          {
            'toUserId': toUserId
          }, {
            'fromUserId': userId
          }
        ]
      },
    ]
  };	    
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('messages').find(data).sort({'timestamp':1}).toArray( (err, result) => {
        DB.close();
        if( err ){
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error)
    }
  });
}

exports.logout = (userID,isSocketId) => {
  const data = {
    $set :{
      online : 'N'
    }
  };
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();		
      let condition = {};
      if (isSocketId) {
        condition.socketId = userID;
      }else{
        condition._id = ObjectID(userID);
      }
      DB.collection('users').update( condition, data ,(err, result) => {
        DB.close();
        if( err ){
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error)
    }
  });
}
