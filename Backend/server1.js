import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large payloads for Base64 images

const screenshotDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

app.get('/', (req, res) => {
   res.status(200).send("Hello from express...middleware!");
  });

app.post('/screenshots', (req, res) => {
  const screenshotData = req.body.screenshot;
  if (!screenshotData) {
    return res.status(400).json({ error: 'No screenshot data provided' });
  }

  console.log("Received Screenshot:", screenshotData);
  const base64Data = screenshotData.replace(/^data:image\/png;base64,/, "");

  console.log("Base64 Data Length:", base64Data.length); // Add this line
  const buffer = Buffer.from(base64Data, 'base64');


  // Save the screenshot to the 'screenshots' folder
  const filename = `screenshot_${Date.now()}.png`;
  const filepath = path.join(screenshotDir, filename);

  fs.writeFile(filepath, buffer, (err) => {
    if (err) {
      console.error('Error saving screenshot:', err);
      return res.status(500).json({ error: 'Failed to save screenshot' });
    }
    console.log('Screenshot saved:', filename);

    console.log('Sending response to client...');
    res.status(200).json({ message: 'Screenshot uploaded successfully', filename });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
