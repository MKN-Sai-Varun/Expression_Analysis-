import express from 'express';

const router = express.Router();

router.post('/receive-data', async (req, res) => {
  try {
    const { Username: username, Password: password } = req.body;
    console.log('Received data from Server 5000:', { username, password });
    global.resentUser = { Username: username, Password: password };
    res.send('Data received successfully!');
  } catch (error) {
    console.error('Error in /receive-data:', error);
    res.status(500).send('Server error occurred!');
  }
});

export default router;