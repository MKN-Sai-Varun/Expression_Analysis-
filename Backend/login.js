// Importing libraries
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRegister from './routes/auth_register.js';
import authLogin from './routes/auth_login.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors()); //Cross origin resource sharing
app.use(express.json()); // Using express.json instead of body parser


//Connecting to mongodb
mongoose.connect(process.env.MONGO_URI1)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));


app.use('/api/auth', authRegister); // Route for register
app.use('/api/auth', authLogin); // Route for login

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});