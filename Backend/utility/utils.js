import { MongoClient } from 'mongodb';
import Counter from '../models/Counter.js'; // Adjust the path as needed
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI;

 global.resentUser=null;

// Function to initialize Session ID if not present in MongoDB 
export const initializeCounter = async () => {
    const existingCounter = await Counter.findOne();
    if (!existingCounter) {
      const counter = new Counter({ value: 0 });
      await counter.save();
    }
  };

// Function to get the current counter value
export const getCurrentCounterValue = async () => {
    const counterDoc = await Counter.findOne();
    return counterDoc ? counterDoc.value : null;
  };

  export const checkStatus = async (sessionCounter) => {
    const client = new MongoClient(mongoUri);
    try {
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('status');
      
      const statusDoc = await collection.findOne({ Session_Id: sessionCounter });
      return statusDoc ? statusDoc.status : null;
    } catch (error) {
      console.error("Error checking status:", error);
      return null;
    } finally {
      await client.close();
    }
  };

// Function to wait for data to be ready before processing
export async function waitForData(sessionCounter) {
    let attempts = 0;
    const maxAttempts = 30;  // Limit the number of attempts to prevent infinite loops
    const delay = 5000; // 5 seconds delay between checks
  
    while (attempts < maxAttempts) {
      const status = await checkStatus(sessionCounter);
      
      if (status === "data_inserted") {
        console.log("Data inserted, proceeding with the operation.");
        return true;  // Data is ready, continue processing
      }
  
      console.log(`Data not yet inserted, retrying... (${attempts + 1}/${maxAttempts})`);
      attempts++;
  
      // Wait before trying again
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  
    console.log("Max attempts reached, data not inserted.");
    return false;  // Data was not inserted in the given attempts
  }

  export async function insertImagePaths(pathsArray, sessionCounter) {
    const client = new MongoClient(mongoUri);
    console.log("Inserting paths into MongoDB. Paths:", pathsArray);
    try {
      await client.connect();
      console.log("Connected to MongoDB client for direct insertion.");
      const database = client.db('test');
      const collection = database.collection('datas');
      const status = await checkStatus(sessionCounter);
      if(status=="data_inserted"){
        const result=await collection.updateOne({Session_Id:sessionCounter},{$set:{Player_images:pathsArray}});
        if(result.acknowledged){
          console.log(`Update acknowledged: ${result.acknowledged}`);
          if(result.modifiedCount){
            console.log(`Document was updated. Modified count: ${result.modifiedCount}`)
          }
          else{
            console.log('No documents were updated (perhaps the data was the same).');
          }
        }else{
          console.log("Update was not acknowledged");
        }
      }
    } catch (error) {
      console.error('Error inserting document:', error);
    } finally {
      await client.close();
      console.log("MongoDB client connection closed.");
    }
  }

  export const updateStatus = async (status,sessionCounter) => {
    const client = new MongoClient(mongoUri);
    try {
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('status');
      
      const result = await collection.updateOne(
        { Session_Id: sessionCounter },
        { $set: { status: status } },
        { upsert: true }  // This will create the document if it doesn't exist
      );
      console.log(`Status updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    } finally {
      await client.close();
    }
  };

  export async function insertSSPaths(pathsArray, sessionCounter) {
    const client = new MongoClient(mongoUri);
    console.log("Inserting paths into MongoDB. Paths:", pathsArray);
    try {
      await client.connect();
      console.log("Connected to MongoDB client for direct insertion.");
  
      const database = client.db('test');
      const collection = database.collection('datas');
      if(!global.resentUser){
        console.log("Either not logged in or user data not received")
      }
      else{
        let date=new Date();
        date.setHours(0,0,0,0);
        date.setMinutes(date.getMinutes()+10);
        let TimeStamps=[]
        for(let i=0;i<pathsArray.length;i++){
            let TimeString=date.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
            TimeStamps.push(TimeString);
            date.setMinutes(date.getMinutes()+10);
        }
        const result=await collection.insertOne({Username:global.resentUser.Username,Password:global.resentUser.Password,Session_Id:sessionCounter,Time_stamps:TimeStamps,Game_screenshots:pathsArray});
        console.log("Data has been inserted Successfully",result.insertedId);
      }
      // const result= await collection.updateOne({session:sessionCounter},{$set:{Screenshot_path:pathsArray}},{upsert:true});
    } catch (error) {
      console.error('Error inserting document:', error);
    } finally {
      await client.close();
      console.log("MongoDB client connection closed."); 
    }
  }
  // Function to determine Screenshot_path or Images_path in MongoDB document
  export async function saveSessionData(pathsArray, sessionCounter, pathType) {
    if (!pathsArray || pathsArray.length === 0) {
      throw new Error('No paths to save');
    }
  
    const paths = {};
    paths[pathType] = pathsArray; // Dynamically set Screenshot_path or Images_path
  
    await insertPaths(sessionCounter, paths, mongoUri);
    console.log(`${pathType} successfully saved to MongoDB.`);
  }
  
