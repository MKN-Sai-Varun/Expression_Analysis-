import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router(); // Router initializing

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body; // Taking all required parameters into body

  try {
    const existingUser = await User.findOne({ username }); // Searches if User exists already
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Converts into hashed password

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    }); // Setting a new user into database

    await newUser.save(); // Intakes save function from User model

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error: ', error);
    res.status(500).json({ message: 'Server error', error: error.message }); // Logging
  }
});

export default router; // Router export
