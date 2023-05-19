const { MongoClient, ObjectId } = require('mongodb');
const {MONGO_URI,MONGO_DB_NAME} = require('../config');

// Set the connection options
const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

let mongoClient;
let numOperations = 0;

function isObject(obj) {
  return Object.keys(obj).length > 0 && obj.constructor === Object
}

  // private method use to open the database connection 
  let connection;

  async function OpenConnection() {
    try {
        const isConnected = mongoClient.topology.isConnected();
        // Check if there is already an open connection
        if (!mongoClient || !isConnected) {
            // If there isn't, establish a new connection
            mongoClient = await MongoClient.connect(MONGO_URI, clientOptions);
        }
    } catch (e) {
        console.error(e);
        // Recreate connection
        mongoClient = await MongoClient.connect(MONGO_URI, clientOptions);
    };
}
 
// private method use to close the database connection
async function CloseConnection() {
    try {
      const isConnected = mongoClient.topology.isConnected();
      // Decrement the number of outstanding operations
      numOperations--;
      console.log(`Number of outstanding operations: ${numOperations}`);
      if (numOperations === 0 && mongoClient && isConnected) {
        // If there are no more outstanding operations, close the connection
        await mongoClient.close();
      }
    } catch (e) {
      console.error(e);
    }
  }

 
// private method use to save a new Doc in MongoDB
async function Create(coll, query)
{
    let insert = "";
    try {
        numOperations++;
        await OpenConnection();
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).insertOne(query);
    } catch (error) {
        //console.log("Hubo un problema con bd");
        console.error(error);
    }
    finally{
        await CloseConnection();
    }    
}
 
// private method use to save a new Doc in MongoDB
async function CreateMany(coll, query)
{
    let insert = "";
    try {
        numOperations++;
        await OpenConnection();
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).insertMany(query);
    } catch (error) {
        //console.log("Hubo un problema con bd");
        console.error(error);
    }
    finally{
        await CloseConnection();
    }    
}
 
// private method use to delete a doc in MongoDB
async function Delete(coll, id)
{
    try {
        numOperations++;
        await OpenConnection();
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).deleteOne({ _id:ObjectId(id) });
    } catch (error) {
        console.error(error);
    }
    finally{
        await CloseConnection();
    }    
}
 
// private method use to update a Document in MongoDB
async function Update(coll, id, updateFields)
{ 
    try {
        numOperations++;
        await OpenConnection();
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).updateMany({ _id: ObjectId(id) }, { $set: updateFields});
    } catch (error) {
        console.error(error);
    }
    finally{
        await CloseConnection();
    }    
}
 
// private method use to get a doc by id in MongoDB
async function GetOne(coll, query ,qProjection = {})
{   
    try {
        numOperations++;
        await OpenConnection();
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).findOne(query, {projection: qProjection});
    } catch (error) {
        console.error(error);
    }
    finally{
        await CloseConnection();
    }    
}
async function GetById(coll, query )
{ 
    try {
        numOperations++;
        await OpenConnection();
        return await mongoClient.db(MONGO_DB_NAME).collection(coll).findOne(query);
    } catch (error) {
        console.error(error);
    }
    finally{
        await CloseConnection();
    }    
}
 
// private method use to get all docs from a collection in MongoDB
async function GetAll(coll, query = {}, qProjection = {}, lookup = { from: '', localField: '', foreignField: '', as: '' }) {
    try {
        numOperations++;
      await OpenConnection();
      const collection = mongoClient.db(MONGO_DB_NAME).collection(coll);
      
      const pipeline = [{ $match: query }];
      
      // Add $project stage only if qProjection object is not empty
      if (Object.keys(qProjection).length > 0) {
        pipeline.push({ $project: qProjection })
      }
      
      // Add $lookup stage if lookup object has all required fields
      if (lookup.from && lookup.localField && lookup.foreignField && lookup.as) {
        pipeline.push({ $lookup: lookup });
      }
      
      const result = await collection.aggregate(pipeline).toArray();
      return result;
    } catch (error) {
      console.error(error);
    } finally {
      await CloseConnection();
    }
  }

module.exports = { Create, CreateMany, Delete, Update, isObject, GetOne, GetAll, GetById };