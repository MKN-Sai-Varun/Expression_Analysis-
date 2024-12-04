
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import DpAnalysis from './DpAnalysis.jsx';
import Login_Game from './Login_Game.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login_Game/>} />
        <Route path="/Admin_Page" element={<Home />} />
        <Route path="/Analysis_Page" element={<DpAnalysis />} />
      </Routes>
    </Router>
    // Ramya-->Don't connect the analysis page to the button yet, once Varun and Pranav are done with their 
    // work, connect
  );
}

export default App;


//Converting into jsx
// /-->For login and game
// /-->Login_and_game_page
// /-->/Admin_Page
// /dpanalysis-->/Analysis_Page
