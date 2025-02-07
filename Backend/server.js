import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import updateCounter from './routes/update_counter.js';
import uploadsRoute from './routes/upload_images.js';
import screenshotRoutes from './routes/screenshot_images.js';
import data from './routes/receive_data.js';
import uploadPaths from './routes/upload_path.js';
import screenshotPaths from './routes/screenshot_paths.js';
import resetVariable from './routes/reset_variable.js';
import {initializeCounter, getCurrentCounterValue} from './utility/utils.js';
import triggerModel from './routes/triggerModel.js';

dotenv.config();
const PORT = 7000; // Port on which the server is run
const mongoUri1 = process.env.MONGO_URI1;

// Create two separate Express app instances
const app1 = express();
const app2 = express();

// Common middleware and configurations
const corsOptions = {
  origin: [process.env.CORS_URL1,process.env.CORS_URL2],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};


app1.use(cors(corsOptions));
app1.use(express.json({ limit: '50mb' }));
app1.use('/pi',express.static(path.join(process.cwd(),'uploads')));

app2.use(cors(corsOptions));
app2.use(express.json({ limit: '50mb' }));
app2.use('/ss',express.static(path.join(process.cwd(),'screenshots')));

mongoose.connect(mongoUri1)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

app1.use('/', updateCounter); // Route for updating counter

initializeCounter();

// Directory for saving images
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Variables for tracking uploads 
global.imageCount = 0;
global.imagePaths = [];

// Routes for `app1` (Stores images in uploads folder)
app1.use('/', uploadsRoute({ getCurrentCounterValue, imageCount, imagePaths }));

// Saving image paths after session is completed
app1.use('/', uploadPaths({getCurrentCounterValue, imagePaths, imageCount}));

const screenshotDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

//Variables for tracking screenshots
global.screenshotCount = 0;
let sessionImagePaths = [];

// Route for saving screenshots
app2.use('/', screenshotRoutes({ getCurrentCounterValue, screenshotCount, screenshotDir, sessionImagePaths }));

app2.use('/',data);

// Route for saving screenshot paths
app2.use('/', screenshotPaths({ getCurrentCounterValue,   sessionImagePaths }));

app1.use('/',resetVariable);
// Route to trigger model processing 
app1.use('/',triggerModel);

// Combine `app1` and `app2` under the same server
const mainApp = express();
mainApp.use(app1);
mainApp.use(app2);

// Start the server
mainApp.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 

