import React,{useState,useEffect} from "react";
import Pie from "./Pie.jsx";
import BarChart from "./Bar.jsx";
import './Overall.css';
import images from "./image.js";
import Pdf from "./Pdf.jsx";
function Overall({total,onClick,text}){
    const dict=[
        {
            label:"angry",
            score:0
        },
        {
            label:"sad",
            score:0
        },
        {
            label:"happy",
            score:0
        },
        {
            label:"surprise",
            score:0
        },
        {
            label:"fear",
            score:0
        },
        {
            label:"neutral",
            score:0
        },
        {
            label:"disgust",
            score:0
        }
    ]
    const emot=total.Emotions;
    const len=emot.length;
    const labels=[];
    const dataPoints=[];
    let date=new Date();
    date.setHours(0,0,0,0);
    date.setMinutes(date.getMinutes()+10);
    for(let i=0;i<len;i++){
        let TimeString=date.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
        labels.push(TimeString);
        date.setMinutes(date.getMinutes()+10);
    }
    emot.map((element)=>{
        let temp=dict.findIndex(item=>item.label===element[0].label);
        dict[temp].score+=element[0].score;
        dataPoints.push(element[0].score);
        // element.map((elem)=>{
        //     let temp=dict.findIndex(item=>item.label===elem.label);
        //     dict[temp].score+=elem.score;
        // });
    })
    const [ch,setCh]=useState({
        dis:"block",
        bas:"100%"
    })
    const [barshow,setBarshow]=useState(false);
    const [but,setBut]=useState("Detailed Analysis");
    useEffect(()=>{
        setCh((prevCh)=>{
            if (text==="Brief Analysis"){
                return {dis:"flex",bas:"80%",jc:"space-around"}
            }else if(text==="Detailed Analysis"){
                return {dis:"flex",bas:"50%",jc:"space-around"};
            }
            return prevCh;
        })
        if(text==="Detailed Analysis"){
            setTimeout(()=>setBarshow(true),300);
            setBut("Brief Analysis")
        }else{
            setBarshow(false);
            setBut("Detailed Analysis")
        }

    },[text])

    return(
        <div className="Flexov" style={{display:ch.dis,gap:"0px"}}>
        <div style={{height:"70vh",width:"25vw",marginLeft:"2rem"}}>
        <p className="OaHeading1">Top Emotions Distribution</p>
        <div style={{height:"65vh"}}>
        <Pie emotions={dict} />
        </div>
        <div style={{display:"flex",justifyContent:"space-around"}}>
        <button type="button" class="btn btn-primary" onClick={async()=>{
            onClick();
        }}>{but}</button>
        <Pdf/>
        </div>
        </div>
        {barshow && <div className="App" style={{width:"25vw"}}>
            
            <BarChart labels={labels} dataPoints={dataPoints} />
        </div>}
        </div>)
}
export default Overall;