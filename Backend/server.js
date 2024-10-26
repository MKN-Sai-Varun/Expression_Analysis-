import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { processImages } from './Model.mjs';
const app = express();
const PORT = 5000;
const mongoUri=process.env.MONGO_URI;

const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from your React app
    methods: ['GET', 'POST', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type'], // Allow these headers
};

app.use(cors(corsOptions));

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large payloads for Base64 images
app.options('/trigger-model', cors(corsOptions)); // Preflight request

// Create uploads folder if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Connection error', error));

// Mongoose schema and model
const DataSchema = new mongoose.Schema({
  paths: [String],
});
const Data = mongoose.model('Data', DataSchema);

// Helper function to retrieve image paths from the screenshots directory
const getImagePaths = () => {
  try {
    return fs.readdirSync(uploadDir)
      .filter(file => file.endsWith('.png'))
      .map(file => `./Backend/uploads/${file}`); // Relative path format
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
};


// Save image paths to MongoDB
const saveData = async () => {
  const imagePaths = getImagePaths();
  
  if (imagePaths.length === 0) {
    console.log('No images found in the directory.');
    return;
  }

  try {
    const data = new Data({ paths: imagePaths });
    const savedData = await data.save();
    console.log('Data saved:', savedData);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

app.get('/', (req, res) => {
   res.status(200).send("Hello from express...middleware!");
  });

// Trigger model processing
app.post('/trigger-model', async (req, res) => {
    try {
        await processImages();  // Call the function to process images
        res.status(200).json({ message: 'Model processing triggered successfully' });
    } catch (error) {
        console.error("Error triggering model:", error);
        res.status(500).json({ error: 'Failed to trigger model' });
    }
});

// Handle image upload (Base64)
app.post('/uploads', async(req, res) => {
  const base64Image = req.body.image;
  if (!base64Image) {
    return res.status(400).json({ error: 'No image data provided' });
  }
  console.log("Received Base64 Image:", base64Image);
  // Remove Base64 prefix
  const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");

  // Save the image to the uploads folder
  const filename = `captured_image_${Date.now()}.png`;
  const filepath = path.join(uploadDir, filename);

  fs.writeFile(filepath, base64Data, 'base64',async (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).json({ error: 'Failed to save image' });
    }
    console.log('Image saved:', filename);
    await saveData();
    res.status(200).json({ message: 'Image uploaded successfully', filename });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
