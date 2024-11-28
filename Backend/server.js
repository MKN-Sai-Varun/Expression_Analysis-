import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { processImages } from './Model.mjs';
import { MongoClient } from 'mongodb';
import { getSystemErrorMap } from 'util';

dotenv.config();

const PORT = 7000; // Port on which the server is run
const mongoUri = process.env.MONGO_URI;
const mongoUri1 = process.env.MONGO_URI1;
app1.post('/reset-variable', (req, res) => {
  screenshotCount = 0;
  imageCount = 0; // Reset the variable
  console.log('Variable reset to 0');
  res.status(200).send({ message: 'Variable has been reset.' });
});
// Create two separate Express app instances
const app1 = express();
const app2 = express();

// Common middleware and configurations
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:9000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};
let resentUser=null;

app1.use(cors(corsOptions));
app1.use(express.json({ limit: '50mb' }));



app2.use(cors(corsOptions));
app2.use(express.json({ limit: '50mb' }));

// MongoDB Schema and Connection
const CounterSchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', CounterSchema, 'counters');
mongoose.connect(mongoUri1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error', error));

// Function to initialize Session ID if not present in MongoDB 
const initializeCounter = async () => {
    const existingCounter = await Counter.findOne();
    if (!existingCounter) {
      const counter = new Counter({ value: 0 });
      await counter.save();
    }
  };
initializeCounter();

// Function to get the current counter value
const getCurrentCounterValue = async () => {
  const counterDoc = await Counter.findOne();
  return counterDoc ? counterDoc.value : null;
};
const checkStatus = async (sessionCounter) => {
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

async function waitForData(sessionCounter) {
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

// Function to Increment the Session ID by 1 in MongoDB everytime a session is played
app1.post('/update-counter', async (req, res) => {
  try {
    const counterDoc = await Counter.findOneAndUpdate(
      {}, // Match the first document (or create a new one if none exists)
      { $inc: { value: 1 } }, // Increment the value field by 1
      { new: true, upsert: true } // Return the updated document
    );
    res.status(200).json({ message: 'Counter updated successfully', counter: counterDoc.value });
  } catch (error) {
    console.error("Error updating counter:", error);
    res.status(500).json({ error: 'Failed to update counter' });
  }
});

// Directory for saving images
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Variables for tracking uploads 
let imageCount = 0;
let imagePaths = [];

// Routes for `app1` (Stores images in uploads folder)
app1.post('/uploads', async (req, res) => {
  const base64Image = req.body.image;
  if (!base64Image) {
    return res.status(400).json({ error: 'No image data provided' });
  }
  let counterValue;
  try {
    counterValue = await getCurrentCounterValue(); // Ensure this function is defined and fetches the session counter
    if (counterValue === null) {
      return res.status(500).json({ error: 'Counter not initialized' });
    }
  } catch (error) {
    console.error('Error accessing counter:', error);
    return res.status(500).json({ error: 'Failed to access counter' });
  }
  imageCount++;

  const filename = `Session${counterValue}_Image${imageCount}.png`;
  const filepath = path.join(uploadDir, filename);
  const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(filepath, base64Data, 'base64', async (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).json({ error: 'Failed to save image' });
    }
    // Generate a relative path for MongoDB storage ../../../Backend/uploads/
    const relativePath = `http://localhost:7000/pi/${filename}`;
    imagePaths.push(relativePath);

    console.log(`User image saved as ${filename}, added to session paths.`);

    res.status(200).json({ message: 'User Image uploaded successfully', filename });
  });
});

// Saving image paths after session is completed
app1.post('/end-session1', async (req, res) => {
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

  // Wait for the main server to insert the data
  const isDataReady = await waitForData(counterValue);
  
  if (!isDataReady) {
    return res.status(400).json({ error: 'Data not ready to process yet' });
  }

  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('datas');

    // Check if a document already exists for the current session
    const existingDocument = await collection.findOne({ Session_Id: counterValue });
    
    if (imagePaths.length > 0) {
      await insertImagePaths(imagePaths, counterValue);
      imagePaths = [];
      imageCount = 0;
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

const screenshotDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

//Variables for tracking uploads
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
// Routes for `app2` (Stores screenshots in the screenshots folder)
app2.post('/screenshots', async (req, res) => {
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

  const filename = `Session${counterValue}_Screenshot${screenshotCount}.png`;
  const filepath = path.join(screenshotDir, filename);

  fs.writeFile(filepath, screenshotData.replace(/^data:image\/png;base64,/, ""), 'base64', (err) => {
    if (err) {
      console.error('Error saving screenshot:', err);
      return res.status(500).json({ error: 'Failed to save screenshot' });
    }
    const relativePath = `./Backend/screenshots/${filename}`;
    sessionImagePaths.push(relativePath);
    res.status(200).json({ message: 'Screenshot uploaded successfully', filename });
  });
});

app2.post('/receive-data',async(req,res)=>{/////////////////////////
  const {Username:username,Password:password}=req.body;
  console.log('Received data from Server 5000:', { username, password });
  res.send('Data received successfully!');
  resentUser={Username:username,Password:password};

});

app2.post('/end-session', async (req, res) => {//screenshots path
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

// Function logic to insert relative paths of both screenshots and images
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
// Function to determine Screenshot_path or Images_path in MongoDB document
async function saveSessionData(pathsArray, sessionCounter, pathType) {
  if (!pathsArray || pathsArray.length === 0) {
    throw new Error('No paths to save');
  }

  const paths = {};
  paths[pathType] = pathsArray; // Dynamically set Screenshot_path or Images_path

  await insertPaths(sessionCounter, paths, mongoUri);
  console.log(`${pathType} successfully saved to MongoDB.`);
}

// Route to trigger model processing 
app1.post('/trigger-model', async (req, res) => {//Receiving the data
  try {
      // const currentSession = await getCurrentCounterValue(); // Retrieve current session value
      const {Session_Id}=req.body;
      if (!Session_Id) {
          return res.status(400).json({ error: 'Did not receive the session_Id' });
      }

      console.log(`Triggering model for Session ${Session_Id}`);
      await processImages(Session_Id); // Pass session value to processImages

      res.status(200).json({ message: `Model processing triggered for Session ${Session_Id}` });
  } catch (error) {
      console.error("Error triggering model:", error);
      res.status(500).json({ error: 'Failed to trigger model' });
  }
});

// Combine `app1` and `app2` under the same server
const mainApp = express();
mainApp.use(app1);
mainApp.use(app2);

// Start the server
mainApp.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});