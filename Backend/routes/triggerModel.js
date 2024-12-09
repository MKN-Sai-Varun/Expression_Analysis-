import express from 'express';
import { processImages } from '../Model.mjs';

const router = express.Router();

router.post('/trigger-model', async (req, res) => {
    try {
        const { Session_Id } = req.body;
        if (!Session_Id) {
            return res.status(400).json({ error: 'Did not receive the session_Id' });
        }

        console.log(`Triggering model for Session ${Session_Id}`);
        let result = await processImages(Session_Id); // Pass session value to processImages
        if (result.message === "Data inserted into Mongo Successfully") {
            console.log("Analysed data inserted into MongoDB");
            res.status(200).json({ message: "Inserted Analysis into MongoDB" });
        } else if (result.message === "Data insertion failed") {
            console.log("Failed in inserting data");
            res.status(400).json({ message: "Failed inserting Analysis into MongoDB" });
        }
    } catch (error) {
        console.error("Error triggering model:", error);
        res.status(500).json({ error: 'Failed to trigger model' });
    }
});

export default router;