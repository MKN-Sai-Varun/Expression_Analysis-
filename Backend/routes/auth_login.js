//Routing to login
import express from 'express';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import User from '../models/User.js';

const router = express.Router(); // Intitalize Routes

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username' }); // Searches for entered Username

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });// Compares hashed password with database

    const userInfo = { Username: username, Password: password };

    try {
      const response = await axios.post(process.env.Login_URL, userInfo);
      console.log('User info sent to server 7000: ', response.data);
    } catch (err) {
      console.error('Failed to send user info to server 7000:', err); // User details sent
    }

    res.json({ message: 'Login successful', role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' }); // Login success message
  }
});

export default router; // Router export


