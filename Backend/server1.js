const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large payloads for Base64 images

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.get('/', (req, res) => {
   res.status(200).send("Hello from express...middleware!");
  });

// Handle image upload (Base64)
app.post('/uploads', (req, res) => {
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

  fs.writeFile(filepath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).json({ error: 'Failed to save image' });
    }
    console.log('Image saved:', filename);
    res.status(200).json({ message: 'Image uploaded successfully', filename });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
