const { MongoClient, ObjectId } = require('mongodb');
const {MONGO_URI,MONGO_DB_NAME} = require('../config');
const mongoClient = new MongoClient(MONGO_URI);

function isObject(obj) {
  return Object.keys(obj).length > 0 && obj.constructor === Object
}

  // private method use to open the database connection 
async function OpenConnection() {
    try {
        // Connect to the MongoDB 
        await mongoClient.connect();
    }
    catch (e) {
        console.error(e)
    };
}
 
// private method use to close the database connection
async function CloseConnection() {  
    try {
        // Close connect to the MongoDB
        await mongoClient.close();
    }
    catch (e) {
        console.error(e)
    };
}
 
// private method use to save a new Doc in MongoDB
async function Create(coll, query)
{
    let insert = "";
    try {
        OpenConnection(mongoClient);
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).insertOne(query);
    } catch (error) {
        //console.log("Hubo un problema con bd");
        console.error(error);
    }
    finally{
        CloseConnection(mongoClient);
    }    
}
 
// private method use to delete a doc in MongoDB
async function Delete(coll, eraseInput)
{
    try {
        OpenConnection(mongoClient);
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).deleteOne({ _id:eraseInput });
    } catch (error) {
        console.error(error);
    }
    finally{
        CloseConnection(mongoClient);
    }    
}
 
// private method use to update a Document in MongoDB
async function Update(coll, testId, updateFields)
{
    try {
        OpenConnection(mongoClient);
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).updateMany({ _id: testId }, { $set: updateFields});
    } catch (error) {
        console.error(error);
    }
    finally{
        CloseConnection(mongoClient);
    }    
}
 
// private method use to get a doc by id in MongoDB
async function GetOne(coll, query )
{   let find = '';
    try {
        OpenConnection(mongoClient);
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).findOne(query);
    } catch (error) {
        console.error(error);
    }
    finally{
        CloseConnection(mongoClient);
    }    
}
 
// private method use to get all docs from a collection in MongoDB
async function GetAll(coll)
{
    try {
        OpenConnection();
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).find({},{projection: { _id: 0 } }).toArray();
    } catch (error) {
        console.error(error);
    }
    finally{
        CloseConnection(mongoClient);
    }    
}

module.exports = { Create, Delete, Update, isObject, GetOne, GetAll };