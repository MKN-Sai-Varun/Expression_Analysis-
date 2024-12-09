import express from 'express';
import Counter from '../models/Counter.js'; // Import Counter model
const router = express.Router(); // Router initializing
// Function to Increment the Session ID by 1 in MongoDB everytime a session is played
router.post('/update-counter', async (req, res) => {
    console.log("Update session by 1 method called.");
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

export default router;