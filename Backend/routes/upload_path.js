import express from 'express';
import { MongoClient } from 'mongodb';
import { insertImagePaths, waitForData } from '../utility/utils.js'; // Import the database-related functions

const router = express.Router(); // Create a new router instance

// This function will set up the route for ending a session
const uploadPaths = ({ getCurrentCounterValue, imagePaths, imageCount }) => {
  router.post('/end-session1', async (req, res) => {
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

    const client = new MongoClient(process.env.MONGO_URI);
    try {
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('datas');

      // Check if a document already exists for the current session
      const existingDocument = await collection.findOne({ Session_Id: counterValue });
      if (existingDocument) {
        console.log('Document for this session already exists. Skipping insertion.');
        return res.status(200).json({ message: 'Session already recorded in MongoDB' });
      }

      // Insert image paths if available
      if (imagePaths.length > 0) {
        await insertImagePaths(imagePaths, counterValue);
        imagePaths = []; // Clear image paths after insertion
        imageCount = 0; // Reset the image count
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

  return router; // Return the router to be used in server.js
};

export default uploadPaths;
