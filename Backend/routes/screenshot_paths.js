import express from 'express';
import { MongoClient } from 'mongodb';
import { insertSSPaths, updateStatus } from '../utility/utils.js'; // Import the database-related functions

const router = express.Router(); // Use Router to define routes

// This function will set up the route for ending a session
const screenshotPaths = ({ getCurrentCounterValue, sessionImagePaths }) => {
  router.post('/end-session', async (req, res) => {
    let counterValue;
    try {
      counterValue = await getCurrentCounterValue();
      if (counterValue === null) {
        console.log('Counter not initialized');
        return res.status(500).json({ error: 'Counter not initialized' });
      }
    } catch (error) {
      console.error('Error accessing counter:', error);
      return res.status(500).json({ error: 'Failed to access counter' });
    }

    const client = new MongoClient(process.env.MONGO_URI);
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
        await insertSSPaths(sessionImagePaths, counterValue);
        await updateStatus('data_inserted', counterValue);
        sessionImagePaths.length = 0; // Clear the session image paths
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
      console.log('MongoDB client connection closed.');
    }
  });

  return router; // Return the router so it can be used in server.js
};

export default screenshotPaths;
