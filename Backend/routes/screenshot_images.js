import fs from 'fs';
import path from 'path';
import express from 'express';

const router = express.Router();

const screenshotRoutes = ({ getCurrentCounterValue, screenshotCount, screenshotDir, sessionImagePaths }) => {
  router.post('/screenshots', async (req, res) => {
    const screenshotData = req.body.screenshot;
    if (!screenshotData) {
      console.log("Didn't receive the screenshots");
      return res.status(400).json({ error: 'No screenshot data provided' });
    }

    console.log(screenshotData);

    let counterValue;
    try {
      counterValue = await getCurrentCounterValue();
      if (counterValue === null) {
        return res.status(500).json({ error: 'Counter not initialized' });
      }
    } catch (error) {
      console.error('Error accessing counter:', error);
      return res.status(500).json({ error: 'Failed to access counter' });
    }

    screenshotCount++;

    const filename = `Session${counterValue}_Screenshot${screenshotCount}.png`;
    const filepath = path.join(screenshotDir, filename);

    fs.writeFile(filepath, screenshotData.replace(/^data:image\/png;base64,/, ""), 'base64', (err) => {
      if (err) {
        console.error('Error saving screenshot:', err);
        return res.status(500).json({ error: 'Failed to save screenshot' });
      }

      const relativePath = `http://localhost:7000/ss/${filename}`;
      sessionImagePaths.push(relativePath);
      res.status(200).json({ message: 'Screenshot uploaded successfully', filename });
    });
  });
  return router;
};

export default screenshotRoutes;
