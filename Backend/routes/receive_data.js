import express from 'express';

const router = express.Router();

router.post('/receive-data',async(req,res)=>{
    const {Username:username,Password:password}=req.body;
    console.log('Received data from Server 5000:', { username, password });
    res.send('Data received successfully!');
    resentUser={Username:username,Password:password};
  
  });

export default router;