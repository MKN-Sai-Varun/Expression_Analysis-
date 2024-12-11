import React,{useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import '../CSS/Session.css';

function Sessions({ session, setCurrentSession }) {
  const [name,setName]=useState("Fetch Analysis");//Intial name-->Fetch Analysis
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if (session.Emotions){
      setName("View Analysis");
    }
  },[])
  const handleFetchAnalysis = async () => {
    setLoading(true);
    if(name==="View Analysis"){
      setCurrentSession(session);
      navigate('/Analysis_Page',{state:{session}});
    }
    else if(!session.Emotions){
      const data={Session_Id:session.Session_Id};
      try {
        const response=await fetch(process.env.REACT_APP_TRIGMODEL_URL,{
          method:'POST',
          headers:{
            'Content-Type':"application/json",
          },
          body:JSON.stringify(data),
        });
        if(response.status===200){
          setName("View Analysis");
        }
      } catch (error) {
        console.error('Error triggering model:', error);
      }
      finally {
        setLoading(false); // Stop loading once the fetch is complete (success or failure)
      }
    }
    // if(name==="Fetch Analysis"){
    //   setName("View Analysis");
    //   const data={Session_Id:session.Session_Id};
    //   try {
    //     const response=await fetch('http://localhost:7000/trigger-model',{
    //       method:'POST',
    //       headers:{
    //         'Content-Type':"application/json",
    //       },
    //       body:JSON.stringify(data),
    //     });
    // } catch (error) {
    //     console.error('Error triggering model:', error);
    // }
    // }
    // else{
    //   setCurrentSession(session);
    //   navigate('/dpanalysis',{state:{session}});
    // }
  };

  return (
    <>
    {loading && (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    )}
    <div className="sessionContainer" >
      <div className="sessionId">Session_Id: {session.Session_Id}</div>
      <div className="userName"><div>Username: {session.Username}</div></div>
      <button type="button" className="btn btn-success fetchView " onClick={handleFetchAnalysis}>{(!session.Emotions)?name:"View Analysis"}</button>
    </div>
    </>
  );
}
export default Sessions;

// const handleButtonClick = async () => {
//   try {
//       const response = await fetch('http://localhost:7000/trigger-model', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//       });

//       const data = await response.json();
//       console.log(data.message); // Handle success response
//   } catch (error) {
//       console.error('Error triggering model:', error);
//   }
// };

// const handleAnalysisClick = () => {
//   // Add action for Analysis button
//   console.log("Analysis button clicked");
//   handleButtonClick();
// };







// setName("View Analysis");
          // const response = await fetch('http://localhost:7000/trigger-model', {
          //     method: 'POST',
          //     headers: {
          //         'Content-Type': 'application/json',
          //     },
          // });
          // const data = await response.json();
          // console.log(data.message); // Handle success response