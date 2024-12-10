import React,{useState,useEffect} from "react";
import Pie from "./Pie.jsx";
import BarChart from "./Bar.jsx";
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
        <div className="Flexov" style={{display:ch.dis,justifyContent:ch.jc}}>
        <div style={{flexBasis:ch.bas,height:"70vh",width:"350px"}}>
        <Pie emotions={dict} />
        <div style={{display:"flex",justifyContent:"space-around"}}>
        <button type="button" class="btn btn-primary" onClick={async()=>{
            onClick();
        }}>{but}</button>
        <button type="button" class="btn btn-dark">PDF</button>
        </div>
        </div>
        {barshow && <div className="App" style={{flexBasis:ch.bas}}>
            
            <BarChart labels={labels} dataPoints={dataPoints} />
        </div>}
        </div>)
}
export default Overall;