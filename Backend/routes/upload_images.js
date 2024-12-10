import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Upload image route
const uploadsRoute = ({ getCurrentCounterValue, imageCount, imagePaths }) => {
    const uploadDir = path.resolve('./uploads'); // Ensure this directory exists
  
    router.post('/uploads', async (req, res) => {
      const base64Image = req.body.image;
  
      if (!base64Image) {
        return res.status(400).json({ error: 'No image data provided' });
      }
  
      let counterValue;
      try {
        counterValue = await getCurrentCounterValue(); // Call the provided function
        if (counterValue === null) {
          return res.status(500).json({ error: 'Counter not initialized' });
        }
      } catch (error) {
        console.error('Error accessing counter:', error);
        return res.status(500).json({ error: 'Failed to access counter' });
      }
  
      // Increment image count
      global.imageCount++;
  
      const filename = `Session${counterValue}_Image${global.imageCount}.png`;
      const filepath = path.join(uploadDir, filename);
  
      const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
      fs.writeFile(filepath, base64Data, 'base64', async (err) => {
        if (err) {
          console.error('Error saving image:', err);
          return res.status(500).json({ error: 'Failed to save image' });
        }
  
        // Generate relative path for MongoDB storage
        const relativePath = `http://localhost:7000/pi/${filename}`;
        global.imagePaths.push(relativePath);
  
        console.log(`User image saved as ${filename}, added to session paths.`);
  
        res.status(200).json({ message: 'User Image uploaded successfully', filename });
      });
    });
  
    return router;
  };
  
  export default uploadsRoute;