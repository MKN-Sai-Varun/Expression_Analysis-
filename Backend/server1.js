import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 4000;
const mongoUri1 = process.env.MONGO_URI1;

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Allow large payloads for Base64 images

// Define the screenshot directory path within Backend folder
const screenshotDir = path.join(process.cwd(), 'screenshots');

// Ensure the screenshots directory exists
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}


const CounterSchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', CounterSchema, 'counters'); // Explicitly specify the collection name as 'counters'

// Connect to MongoDB
mongoose.connect(mongoUri1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Connection error', error));



// Helper function to retrieve image paths from the screenshots directory
const getImagePaths = () => {
  try {
    return fs.readdirSync(screenshotDir)
      .filter(file => file.endsWith('.png'))
      .map(file => `./Backend/screenshots/${file}`); // Relative path format
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

const getCurrentCounterValue = async () => {
  const counterDoc = await Counter.findOne();
  return counterDoc ? counterDoc.value : null;
};
// Routes
app.get('/', (req, res) => {
  res.status(200).send("Hello from express...middleware!");
});
let screenshotCount = 0;

app.post('/screenshots', async (req, res) => {  
  const screenshotData = req.body.screenshot;
  if (!screenshotData) {
    return res.status(400).json({ error: 'No screenshot data provided' });
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

  screenshotCount++;
  console.log("Received Screenshot:", screenshotData);
  const base64Data = screenshotData.replace(/^data:image\/png;base64,/, "");
  

  // Save the screenshot to the 'screenshots' folder within Backend
  const filename = `Screenshot${screenshotCount}_Session${counterValue}.png`;
  const filepath = path.join(screenshotDir, filename);

  fs.writeFile(filepath, base64Data, 'base64', async (err) => {
    if (err) {
      console.error('Error saving screenshot:', err);
      return res.status(500).json({ error: 'Failed to save screenshot' });
    }
    console.log('Screenshot saved:', filename);

    // Save data to MongoDB after saving the screenshot
    //await saveData();

    res.status(200).json({ message: 'Screenshot uploaded successfully', filename });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
