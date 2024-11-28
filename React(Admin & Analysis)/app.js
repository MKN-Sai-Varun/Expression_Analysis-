import cors from 'cors';
import express from 'express';
import {MongoClient,ObjectId} from "mongodb";
import uri from "./atlas_uri.js";
import data from './output.json' assert {type: 'json'};
const client= new MongoClient(uri);
const dbname = "test";
const student_collection="datas";
let stu;
let total;
let Username;
let Password;
let DATABASE;
let final_Database=[];
const app=express();
const port=6000;
app.use(express.json());
app.use(cors({
    origin:'http://localhost:9000',
}))

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database`);
        stu=client.db(dbname).collection(student_collection);
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
        throw err;
    }
};
const login={
    "Username": "Session_1_Name",
    "Password":1,
};
const array1={
    "Game_screenshots":[
        '../../../Backend/screenshots/Session1_Screenshot1.png',
        '../../../Backend/screenshots/Session1_Screenshot2.png',
        '../../../Backend/screenshots/Session1_Screenshot3.png',
        '../../../Backend/screenshots/Session1_Screenshot4.png',
        '../../../Backend/screenshots/Session1_Screenshot5.png',
      ]
}
const array2={
    "Player_images":[
        '../../../Backend/uploads/Session1_Image1.png',
        '../../../Backend/uploads/Session1_Image2.png',
        '../../../Backend/uploads/Session1_Image3.png',
        '../../../Backend/uploads/Session1_Image4.png',
        '../../../Backend/uploads/Session1_Image5.png',
      ]
}
const result1={
    "Emotions":[]
}
const TimeStamps={
    "Time_stamps":[]
}

const student=async()=>{
    try {
        await connectToDatabase();
        console.log("Connected to database successfully");
        for (let i=0;i<data.length;i++){
            //array2.Player_images.push(data[i].image);
            result1.Emotions.push(data[i].result);
        }
        console.log("Processing timestamps...");
        let date=new Date();
        date.setHours(0,0,0,0);
        date.setMinutes(date.getMinutes()+10);
        for(let i=0;i<data.length;i++){
            let TimeString=date.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
            TimeStamps.Time_stamps.push(TimeString);
            date.setMinutes(date.getMinutes()+10);
        }
        let RecentDocument=await stu.findOne({},{sort:{_id:-1}});
        let Se_Id;
        if(!RecentDocument){
            Se_Id=0;
        }
        else{
            let Prev_Id=RecentDocument.Session_Id;
            Se_Id=Prev_Id+1;
        }
        login.Session_Id=Se_Id;
        login.Time_stamps=TimeStamps.Time_stamps;
        login.Emotions=result1.Emotions;
        login.Player_images=array2.Player_images;
        login.Game_screenshots=array1.Game_screenshots;
        console.log("Final login object:",login);
        // let final_result= await stu.insertOne(login);
        // console.log("Document inserted:",final_result.insertedId);\
        let name="";
        let namewise_List=[];
        let DATABASE=await stu.find({},{sort:{Username:1}}).toArray();
        console.log(DATABASE);
        console.log("Final_Database");
        let counter=0;
        {DATABASE.map((doc,index)=>{
            let temp_name=doc.Username;
            if(name===""){
                name=temp_name;
                namewise_List.push(doc);
            }else if(name===temp_name){
                namewise_List.push(doc);
            }else if(name!==temp_name){
                counter+=1;
                name=temp_name;
                final_Database.push(namewise_List);
                namewise_List=[doc];
            }
        })}
        if(namewise_List.length>0){
            final_Database.push(namewise_List);
        }
        console.log(final_Database);
        console.log("DATABASE intialized");
    }catch(err){
        console.log(`Found Error:${err}`);
        throw err;
    }
};




await student();

app.get('/api/data',async(req,res)=>{
    try{
        if(!final_Database){
            console.log("Initializing DATABASE...");
            await student();
        }
        res.json(final_Database);
        console.log("Got it");
        console.log(final_Database);
    }catch(err){
        console.log("Error in /api/data:",err)
        res.status(500).send({message: `Error retrieving data: ${err}`});
    }
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});