import React,{useState} from "react";
import "../CSS/Drop.css";
import Sessions from './Sessions.jsx';
function Drop({list_doc,key,setCurrentSession}){
    const [drop,setDrop]=useState(false);
    const [rad,setRad]=useState(10);
    const handleDrop=()=>{
        setDrop(!drop);
        setRad((prev)=>{
            if(prev==10){
                return 0;
            }else{
                return 10;
            }
        })
    }
    return(
    <div className="dropDownToggle" >
        <div className="dropDown" onClick={handleDrop} style={{borderBottomLeftRadius:`${rad}px`,borderBottomRightRadius:`${rad}px`}}><div className="Name" >Name: {list_doc[0].Username}</div> </div>
        <div className={`dropContent ${drop ? "open":""}`}>
            {list_doc.map((doc,index)=>(
                <Sessions key={index} session={doc} setCurrentSession={setCurrentSession}/>
            ))}
        </div>
    </div>);

}


export default Drop;

// {/* <div className="CON" >
//         <div className="dropDown" onClick={handleDrop}><div className="Name" >Name: {list_doc[0].Username}</div> </div>
//         {(drop===true)?list_doc.map((doc,index)=>(
//             <Sessions key={index}
//             session={doc}
//             func={func}/>
//         )):null}
//     </div>) */}
// {/* <div className="CON" key={index1}>
//             <div className="dropDown"><div onClick={handleDrop}>{list_doc[0].Username}</div></div>
//             {(drop===true)?list_doc.map((doc, index) => (
//               <Sessions
//                 key={index}
//                 session={doc}
//                 setCurrentSession={setCurrentSession}
//               />
//             )):null}
//             {/* {list_doc.map((doc, index) => (
//               <Sessions
//                 key={index}
//                 session={doc}
//                 setCurrentSession={setCurrentSession}
//               />
//             ))} */}