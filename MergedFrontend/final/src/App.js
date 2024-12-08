
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import Analysis from './Analysis.jsx';
import Login_Game from './Login_Game.jsx';
import Play from "./Play.jsx";
import Game from "./Game.jsx";
import Register from "./Register.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login_Game/>} />
        <Route path="/Play_Page" element={<Play/>}/>
        <Route path="/Game_Page" element={<Game/>}/>
        <Route path="/Register_Page" element={<Register/>}/>
        <Route path="/Admin_Page" element={<Home />} />
        <Route path="/Analysis_Page" element={<Analysis />} />
      </Routes>
    </Router>
  );
}

export default App;


//Converting into jsx
// /-->For login and game
// /-->Login_and_game_page
// /-->/Admin_Page
// /dpanalysis-->/Analysis_Page
