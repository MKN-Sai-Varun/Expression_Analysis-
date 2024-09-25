import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';  // Import MongoDB client
import dotenv from 'dotenv';
dotenv.config();

const apiUrl = "https://api-inference.huggingface.co/models/trpakov/vit-face-expression";
const accessToken = process.env.MODEL_KEY;
const folderPath = './uploads';
const mongoUri = 'mongodb+srv://user:user@cluster0.es02p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';  // Replace with your MongoDB connection string
const dbName = 'Model';  // Replace with your database name
const collectionName = 'Test';  // Replace with your collection name

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
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/octet-stream",  // Correct Content-Type for binary data
            },
            method: 'POST',
            body: data  // Send binary data in the body
        });

        if (!response.ok) {
            throw new Error(`Error with status ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error querying the model:", error);
        return null;
    }
}


async function insertResultsToMongo(results) {
    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        
        await collection.insertMany(results);
        console.log("Results inserted into MongoDB");
    } catch (error) {
        console.error("Error inserting data into MongoDB:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}


async function processImages() {
    const images = getImagesFromDirectory(folderPath);
    const results = [];

    for (const image of images) {
        const imagePath = path.join(folderPath, image);
        console.log(`Processing: ${imagePath}`);

        const result = await query(imagePath);
        if (result) {
            results.push({ image: image, result: result });  
        }
    }

    
    if (results.length > 0) {
        await insertResultsToMongo(results);
    } else {
        console.log("No results to insert into MongoDB");
    }
}

processImages();
