import React, { useState } from 'react';
import ana from '../Assets/analysisIcon.png';
import game from '../Assets/gameIcon.png';
import './styleNavbar.css'

function Navbar() {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false); // State to control navbar visibility

    const toggleNavbar = () => {
        setIsNavbarOpen(prevState => !prevState); // Toggle the navbar visibility
    };

    const handleButtonClick = async () => {
        try {
            const response = await fetch('http://localhost:7000/trigger-model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
  
            const data = await response.json();
            console.log(data.message); // Handle success response
        } catch (error) {
            console.error('Error triggering model:', error);
        }
    };
    
    const handleAnalysisClick = () => {
        // Add action for Analysis button
        console.log("Analysis button clicked");
        handleButtonClick();
    };

    const handleGameClick = () => {
        // Add action for Game button
        console.log("Game button clicked");
    };

    return (
        <div>
            {/* Hamburger button */}
            <button className="hamburger" onClick={toggleNavbar}>
                &#9776; {/* Hamburger icon */}
            </button>

            {/* Navbar menu */}
            <nav className={`navbar ${isNavbarOpen ? "visible" : ""}`}>
                <ul>
                    <li>
                        <div className="nav-item">
                            <img 
                                className="icon" 
                                src={ana} 
                                alt="Analysis Icon" 
                            />
                            <button className="nav-text" onClick={handleAnalysisClick}>
                                Analysis
                            </button>
                        </div>
                    </li>
                    <li>
                        <div className="nav-item">
                            <img 
                                className="icon" 
                                src={game} 
                                alt="Game Icon" 
                            />
                            <button className="nav-text" onClick={handleGameClick}>
                                Game
                            </button>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
