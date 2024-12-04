import fs from 'fs';
import path from 'path'; // Importing Libraries
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';  // Import MongoDB client
import dotenv from 'dotenv';
dotenv.config();

const apiUrl = process.env.API_URL;
const accessToken = process.env.MODEL_KEY;
const folderPath = './uploads';
const mongoUri = process.env.MONGO_URI;  // Connection String in env
const dbName = 'test';  // Database name
const collectionName = 'datas';  // Collection name

// Function to get image files from the directory
function getImagesFromDirectory(directory) {
    return fs.readdirSync(directory).filter(file => {
        const fileExtension = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(fileExtension);
    });
}

// Function to send image data to Hugging Face API
async function query(imagePath) {
    try {
        const data = fs.readFileSync(imagePath);  // Read binary data from the image
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,  // Access token from env file
                "Content-Type": "application/octet-stream",  // Correct Content-Type for binary data
            },
            method: 'POST',
            body: data  // Send binary data in the body
        });

        if (!response.ok) {
            throw new Error(`Error with status ${response.status}: ${response.statusText}`);  // Fixed error message syntax
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error querying the model:", error.message);  // Improved error logging
        return null;
    }
}

async function insertResultsToMongo(session,Emotions) {
    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        const collection = db.collection(collectionName); // Collection name
        await collection.updateOne({Session_Id:session},{$set:{Emotions}});
        console.log("Results inserted into MongoDB");
    } catch (error) {
        console.error("Error inserting data into MongoDB:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed"); // Connection closed
    }
}

async function processImages(session) {
    const images = getImagesFromDirectory(folderPath);
    const sessionImages = images.filter(image => image.startsWith(`Session${session}_`));//Preetham // Filter images by session
    const Emotions = [];

    if (sessionImages.length === 0) {
        console.log(`No images found for Session ${session}`);
        return;
    }

    for (const image of sessionImages) {
        const imagePath = path.join(folderPath, image);
        console.log(`Processing: ${imagePath}`);     // Message to obtain the image being processed

        const result = await query(imagePath);
        console.log(result);
        if (result) {
            Emotions.push(result); // Include session info in the result
        }
    }

    if (Emotions.length > 0) {
        await insertResultsToMongo(session,Emotions);
    } else {
        console.log("No results to insert into MongoDB");
    }
}

export { processImages };