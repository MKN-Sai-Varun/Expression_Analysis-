import {React,useEffect} from "react";
import "./Play.css";
import Home_Navbar from "./Home_Navbar.jsx";
import {useNavigate} from "react-router-dom";
function Play(){
  const navigate=useNavigate();
    const handlePlayButtonClick = async () => {//Use Effect in Game_Page
      navigate("/Game_Page") // Move to the game page,{state:{handleExitGame}}
      //******************************************************************** */
  };
    return(<div id="playPage">
        <div className="Flex_Play">
          <Home_Navbar clasName="navbar"/>
          <button type="button" className="btn btn-success playButton" onClick={handlePlayButtonClick}>Play</button>
        </div>
      </div>);
}
export default Play;
//Done