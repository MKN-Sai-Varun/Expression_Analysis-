import React,{useState,useEffect} from "react";
import BC from "./Bar.jsx";
import "./Instances.css";
import { Doughnut } from 'react-chartjs-2';
import Pie from "./Pie.jsx";
import Pdf from "./Pdf.jsx";
function Instances({data,onClick,text}){
    const pi=data.pi;
    const ts=data.ts;
    const gs=data.gs;
    const em=data.em;
    const [bu,setBu]=useState("Detailed Analysis");
    const [chan,setChan]=useState({
        dis:"block",
        l_align:"center",
        l_fb:"100%",
    });
    const [pieshow,setPieShow]=useState(false)
    const labels=[];
    const dataPoints=[];
    {em.map((data,index)=>{
        labels.push(data.label);
        dataPoints.push(data.score);
    })}
    useEffect(()=>{
        if (text==="Detailed Analysis"){
            setChan({dis:"flex",l_align:"flex-start",l_fb:"50%",mar:"2vw",transi:"display 3s ease"});
            setBu("Brief Analysis");
            setTimeout(()=>{
                setPieShow(true);
            },300)
        }
        else if(text==="Brief Analysis"){
            setChan({dis:"block",l_align:"center",l_fb:"100%",mar:""});
            setPieShow(false);
            setBu("Detailed Analysis")
        }
    },[text]);
    // function change(){//Turning these into useEffects functions resolves this issue and changing activating it everytime text changes and button is clicked
    //     if (text==="Detailed Analysis"){
    //         setChan({dis:"flex",l_align:"flex-start",l_fb:"50%",mar:"2vw",transi:"display 3s ease"});
    //         setBu("Brief Analysis");
    //         setTimeout(()=>{
    //             setPieShow(true);
    //         },300)
    //     }
    //     else if(text==="Brief Analysis"){
    //         setChan({dis:"block",l_align:"center",l_fb:"100%",mar:""});
    //         setPieShow(false);
    //         setBu("Detailed Analysis")
    //     }
    // }
    return(
        <div className="Flex1" style={{display:chan.dis,transition:chan.transi}}>
    <div className="imagesPiegGraphs" style={{flexBasis:chan.l_fb}}>
        <img src={gs} className="gameScreenshot"alt="Game Screenshots" style={{alignSelf:chan.l_align,marginLeft:chan.mar}}></img>
        
        <img src={pi} className="playerImage" alt="Player Images" style={{alignSelf:chan.l_align,marginLeft:chan.mar}}></img>
        <div style={{display:"flex",justifyContent:"space-evenly",width:"25vw"}}>
        <button type="button" class="btn btn-primary" onClick={async()=>{
            onClick();
        }}>{bu}</button>
        {/* <button type="button" class="btn btn-dark">PDF</button> */}
        <Pdf />
        </div>
        
    </div>
    <div className="Flex3">
        <div className="Pie">{(pieshow===true)?<BC labels={labels} dataPoints={dataPoints} />:null}</div>
    </div>
    </div>
    );

}
export default Instances;
//<div className="Pie">{(pieshow===true)?<Pie emotions={em}/>:null}</div>
//<BarChart labels={labels} dataPoints={dataPoints} />