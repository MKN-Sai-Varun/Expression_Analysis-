import { MongoClient } from "mongodb";
import express from 'express';
import uri from "./atlas_uri.js";
import data from './output.json' assert {type: 'json'};

const re = express();
const port = 3000;
const client = new MongoClient(uri);
const dbname = "Analysis";
const student_collection = "stu";
let stu;

re.use(express.json());

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database`);
        stu = client.db(dbname).collection(student_collection);
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
        throw err;
    }
};

const array1 = {
    "Game_screenshots": [
        "screenshot_17223525626265262.png",
        "screenshot_17223525626261111.png",
         "screenshot_17223525626262222.png",
         "screenshot_17223525626263333.png",
         "screenshot_17223525626264444.png", 
         "screenshot_17223525626265555.png",
         "screenshot_17223525626266666.png",
         "screenshot_17223525626267777.png",
         "screenshot_17223525626268888.png",
         "screenshot_17223525626269999.png",
         "screenshot_17223525626260000.png",
         "screenshot_17223525626261234.png",
         "screenshot_17223525626265678.png",
         "screenshot_17223525626260987.png",
         "screenshot_17223525626266543.png",
         "screenshot_17223525626265432.png",
         "screenshot_17223525626261029.png",
         "screenshot_17223525626264756.png"]
        
};
const array2 = {
    "Player_images": []
};
const result1 = {
    "Emotions": []
};
const TimeStamps = {
    "Time_stamps": []
};

re.post('/login', async (req, res) => {
    const { Username, Password } = req.body;
    if (!Username || !Password) {
        return res.status(400).json({ error: "Username and Password are required" });
    }
    
    try {
        await connectToDatabase();
        
        await student(Username, Password);
        
        res.status(200).json({ message: 'Data has been received and inserted successfully' });
        console.log(`Username: ${Username}, Password: ${Password}`);
    } catch (err) {
        res.status(500).json({ error: `Error occurred: ${err}` });
    }
});
const student = async (Username, Password) => {
    try {
        console.log("Connected to database successfully");
        console.log(data);
        
        for (let i = 0; i < data.length; i++) {
            array2.Player_images.push(data[i].image);
            result1.Emotions.push(data[i].result);
        }
        
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        for (let i = 0; i < data.length; i++) {
            let TimeString = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            TimeStamps.Time_stamps.push(TimeString);
            date.setMinutes(date.getMinutes() + 10);
        }

        let RecentDocument = await stu.findOne({}, { sort: { _id: -1 } });
        let Se_Id = RecentDocument ? RecentDocument.Session_Id + 1 : 0;
        let login = {
            Username,
            Password,
            Session_Id: Se_Id,
            Time_stamps: TimeStamps.Time_stamps,
            Emotions: result1.Emotions,
            Player_images: array2.Player_images,
            Game_screenshots: array1.Game_screenshots
        };
        
        console.log(login);
    
        await stu.insertOne(login);
        console.log("The document has been successfully inserted into the collection");
        
    } catch (err) {
        console.log(`Found Error: ${err}`);
        throw err;
    }
};

re.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// app.js
// import {MongoClient,ObjectId} from "mongodb";
// import express from 'express';
// import uri from "./atlas_uri.js";
// import data from './output.json' assert {type: 'json'};
// const re=express();
// const port=3000;
// const client= new MongoClient(uri);
// const dbname = "Analysis";
// const student_collection="stu";
// let stu;
// let total;
// let Username;
// let Password;
// const connectToDatabase = async () => {
//     try {
//         await client.connect();
//         console.log(`Connected to the ${dbname} database`);
//         stu=client.db(dbname).collection(student_collection);


//     } catch (err) {
//         console.error(`Error connecting to the database: ${err}`);
//         throw err;
//     }
// };
// // const login={
// //     "Username": "Preetham",
// //     "Password":1234
// // };
// const array1={
//     "Game_screenshots":["screenshot_17223525626265262.png",
//         "screenshot_17223525626261111.png",
//         "screenshot_17223525626262222.png",
//         "screenshot_17223525626263333.png",
//         "screenshot_17223525626264444.png", 
//         "screenshot_17223525626265555.png",
//         "screenshot_17223525626266666.png",
//         "screenshot_17223525626267777.png",
//         "screenshot_17223525626268888.png",
//         "screenshot_17223525626269999.png",
//         "screenshot_17223525626260000.png",
//         "screenshot_17223525626261234.png",
//         "screenshot_17223525626265678.png",
//         "screenshot_17223525626260987.png",
//         "screenshot_17223525626266543.png",
//         "screenshot_17223525626265432.png",
//         "screenshot_17223525626261029.png",
//         "screenshot_17223525626264756.png"]
// }
// const array2={
//     "Player_images":[]
// }
// const result1={
//     "Emotions":[]
// }
// const TimeStamps={
//     "Time_stamps":[]
// }
// re.post('/login',async(req,res)=>{
//     const {Username,Password}=req.body;
//     if(!Username || !Password){
//         return res.status(400).json({error: "Username and Password are required"});
//     }
//     try{
//         await connectToDatabase();
//         login={
//             Username,
//             Password
//         }
//         res.status(200).json({message: 'Data has been recieved successfully'});
//         console.log(Username);
//         console.log(Password);
//     }catch(err){
//         res.status(500).json({error:`Error occurred: ${err}`})
//     }
    
// })
// re.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
// const student=async()=>{
//     try {
//         await connectToDatabase();
//         console.log("Connected to database successfully");
//         console.log(data);
//         for (let i=0;i<data.length;i++){
//             array2.Player_images.push(data[i].image);
//             result1.Emotions.push(data[i].result);
//         }
//         console.log(array2.Player_images);
//         console.log(result1.Emotions);
//         let date=new Date();
//         date.setHours(0,0,0,0);
//         date.setMinutes(date.getMinutes()+10);
//         for(let i=0;i<data.length;i++){
//             let TimeString=date.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
//             TimeStamps.Time_stamps.push(TimeString);
//             date.setMinutes(date.getMinutes()+10);
//         }
//         let RecentDocument=await stu.findOne({},{sort:{_id:-1}});
//         let Se_Id;
//         if(!RecentDocument){
//             Se_Id=0;
//         }
//         else{
//             let Prev_Id=RecentDocument.Session_Id;
//             Se_Id=Prev_Id+1;
//         }
//         login.Session_Id=Se_Id;
//         login.Time_stamps=TimeStamps.Time_stamps;
//         login.Emotions=result1.Emotions;
//         login.Player_images=array2.Player_images;
//         login.Game_screenshots=array1.Game_screenshots;
//         console.log(login);
//         let final_result=stu.insertOne(login);
//         console.log("The document has been successfully inserted into the collection");
//     }catch(err){
//         console.log(`Found Error:${err}`);
//         throw err;
//     }
// };
// const Database = async () => {
//     await connectToDatabase(); 
//     total = await stu.find({}).toArray();
// };
// // await student();
// // await Database();
// // export default total;

