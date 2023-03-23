const Mongodb = require("./../config/db");


exports.userNameCheck = (data) => {
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('users').find(data).count( (error, result) => {
        DB.close();
        if( error ){
          reject(error);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error)
    }
  });
}

exports.registerUser = (data) => {
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('users').insertOne(data, (err, result) =>{
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

exports.getUserByUsername = (username) => {
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('users').find({
        username :  username
      }).toArray( (error, result) => {
        DB.close();
        if( error ){
          reject(error);
        }
        resolve(result[0]);
      });
    } catch (error) {
      reject(error)
    }	
  });
}

exports.makeUserOnline = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('users').findAndModify({
        _id : ObjectID(userId)
      },[],{ "$set": {'online': 'Y'} },{new: true, upsert: true}, (err, result) => {
        DB.close();
        if( err ){
          reject(err);
        }
        resolve(result.value);
      });
    } catch (error) {
      reject(error)
    }	
  });
}

exports.userSessionCheck = (data) => {
  return new Promise( async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      DB.collection('users').findOne( { _id : ObjectID(data.userId) , online : 'Y'}, (err, result) => {
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