import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { getSystemErrorMap } from 'util';

dotenv.config();

const app = express();
const PORT = 4000;
const mongoUri1 = process.env.MONGO_URI1;
const mongoUri = process.env.MONGO_URI;

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};
let resentUser=null;

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use('/ss',express.static(path.join(process.cwd(),'screenshots')));
// Define the screenshot directory path within Backend folder
const screenshotDir = path.join(process.cwd(), 'screenshots');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const CounterSchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', CounterSchema, 'counters');

mongoose.connect(mongoUri1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB via mongoose'))
.catch((error) => console.error('Connection error', error));

const getCurrentCounterValue = async () => {
  const counterDoc = await Counter.findOne();
  return counterDoc ? counterDoc.value : null;
};

let screenshotCount = 0;
let sessionImagePaths = [];

const updateStatus = async (status,sessionCounter) => {
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

// Enhanced insert function with logging
async function insertImagePaths(pathsArray, sessionCounter) {//screenshots path
  const client = new MongoClient(mongoUri);
  console.log("Inserting paths into MongoDB. Paths:", pathsArray);
  try {
    await client.connect();
    console.log("Connected to MongoDB client for direct insertion.");

    const database = client.db('test');
    const collection = database.collection('datas');
    if(!resentUser){
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
      const result=await collection.insertOne({Username:resentUser.Username,Password:resentUser.Password,Session_Id:sessionCounter,Time_stamps:TimeStamps,Game_screenshots:pathsArray});
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

app.post('/screenshots', async (req, res) => {
  const screenshotData = req.body.screenshot;
  if (!screenshotData) {
    console.log("Didn't receive the screenshots");
    return res.status(400).json({ error: 'No screenshot data provided' });
    
  }
  console.log(screenshotData);

  let counterValue;
  try {
    counterValue = await getCurrentCounterValue();
    if (counterValue === null) {
      return res.status(500).json({ error: 'Counter not initialized' });
    }
  } catch (error) {
    console.error('Error accessing counter:', error);
    return res.status(500).json({ error: 'Failed to access counter' });
  }

  screenshotCount++;
  const base64Data = screenshotData.replace(/^data:image\/png;base64,/, "");

  const filename = `Session${counterValue}_Screenshot${screenshotCount}.png`;
  const filepath = path.join(screenshotDir, filename);

  fs.writeFile(filepath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving screenshot:', err);
      return res.status(500).json({ error: 'Failed to save screenshot' });
    }

    // Generate a relative path for MongoDB storage ../../../Backend/uploads/${filename}
    const relativePath = `http://localhost:4000/ss/${filename}`;
    sessionImagePaths.push(relativePath);
    console.log(`Screenshot saved as ${filename}, added to session paths.`);
    res.status(200).json({ message: 'Screenshot uploaded successfully', filename });
  });
});
app.post('/receive-data',async(req,res)=>{/////////////////////////
  const {Username:username,Password:password}=req.body;
  console.log('Received data from Server 5000:', { username, password });
  res.send('Data received successfully!');
  resentUser={Username:username,Password:password};

});
app.post('/end-session', async (req, res) => {//screenshots path
  let counterValue;
  try {
    counterValue = await getCurrentCounterValue();
    if (counterValue === null) {
      console.log("Counter not intialized");
      return res.status(500).json({ error: 'Counter not initialized' });
    }
  } catch (error) {
    console.error('Error accessing counter:', error);
    return res.status(500).json({ error: 'Failed to access counter' });
  }

  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('datas');

    // Check if a document already exists for the current session
    const existingDocument = await collection.findOne({ session: counterValue });
    if (existingDocument) {
      console.log('Document for this session already exists. Skipping insertion.');
      return res.status(200).json({ message: 'Session already recorded in MongoDB' });
    }

    if (sessionImagePaths.length > 0) {
      await insertImagePaths(sessionImagePaths, counterValue);
      await updateStatus('data_inserted',counterValue);
      sessionImagePaths = [];
      screenshotCount = 0;
      console.log('Session images successfully saved to MongoDB and cleared from memory.');
      res.status(200).json({ message: 'Session images saved to MongoDB' });
    } else {
      console.log('No images to save. Skipping MongoDB insertion.');
      res.status(400).json({ error: 'No images found for session.' });
    }
  } catch (error) {
    console.error('Error during session save:', error);
    res.status(500).json({ error: 'Failed to save session' });
  } finally {
    await client.close();
    console.log("MongoDB client connection closed.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
