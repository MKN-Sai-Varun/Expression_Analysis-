import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles1.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'webcamjs';
import Navbar from '../Componenets/navbar.js';
import Game from '../Componenets/game.js'; // Import the Game component
import html2canvas from 'html2canvas';
import Register from '../Componenets/Register.js'; // Import the Register component
// import Home from '../../React(Admin & Analysis)/final/src/Home.jsx';
function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role,setRole]=useState('')
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('login');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const captureInterval = useRef(null);
  const webcamAttached = useRef(false); // To track if webcam is already started

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    setError(''); // Clear any previous error messages

    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            username,
            password,
        });
        console.log("Login successful!");
        const userRole = response.data.role;
        // Navigate to the appropriate page based on the user role
        if (userRole === 'kid') {
            setCurrentPage('play');
        } else if (userRole === 'admin') {
            setCurrentPage('Home');
        }
        alert(`Welcome, ${username}! You have successfully logged in.`);
    } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
            const errorMessage = error.response.data.message;
            setError(errorMessage); // Update the error state to display a message
            alert(errorMessage);    // Show an alert popup with the error message
        } else {
            const serverErrorMessage = 'Server error, please try again later.';
            setError(serverErrorMessage); // Update state with a fallback message
            alert(serverErrorMessage);    // Show an alert popup for server issues
        }
    }
};

  // Add a function to handle the Register button click
  const handleRegisterClick = () => {
    setCurrentPage('register');
  };
  

// Inside the return block
{currentPage === 'register' && (
  <Register setCurrentPage={setCurrentPage} />  // Pass the function to Register component
)}


  // Storing relative paths of screenshots
  const storingScreenshotsPaths = () => {
    console.log("End session of screenshots called.");
    fetch('http://localhost:7000/end-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          console.log(data.message); // Expected success message from the server
        } else if (data.error) {
          console.error("Error:", data.error); // Error message from the server if something went wrong
        }
      })
      .catch((error) => console.error('Request failed:', error));
  };
// Storing relative paths of images
  const storingImagePaths = () => {
    console.log("End session of uploads called.");
    fetch('http://localhost:7000/end-session1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          console.log(data.message); // Expected success message from the server
        } else if (data.error) {
          console.error("Error:", data.error); // Error message from the server if something went wrong
        }
      })
      .catch((error) => console.error('Request failed:', error));
  };
// Increment counter and send updated count to the server

  const handleCounter = async () => {
    const newCounterValue = counter + 1;
    setCounter(newCounterValue);
    try {
      await axios.post('http://localhost:7000/update-counter', { value: newCounterValue });
      console.log(`Counter updated to ${newCounterValue}`);
    } catch (error) {
      console.error("Error updating counter:", error);
    }
  };
  const handlePlayButtonClick = async () => {
    setIsGameOver(false); // Reset game over state
    setCounter(0); // Reset counter
    handleCounter(); // Update counter
    setCurrentPage('game'); // Move to the game page
    startCamera();
    // Start the camera only if it hasn't been started yet
    if (!webcamAttached.current) {
        startCamera();
        webcamAttached.current = true; // Mark the webcam as attached
    }
    // Send a POST request to reset a server-side variable
    try {
        const response = await fetch('http://localhost:7000/reset-variable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Variable reset successfully!');
        } else {
            console.log('Failed to reset variable.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to the server.');
    }
};

  const captureImage = () => {
    console.log("Capturing Image...");
    Webcam.snap(async (data_uri) => {
      await uploadImage(data_uri); // Send Base64 data directly
    });
  };

  const uploadImage = async (base64Image) => {
    console.log("Uploading Image...");
    try {
      const jsonData = { image: base64Image };
      const uploadResponse = await axios.post('http://localhost:7000/uploads', jsonData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Image uploaded successfully:', uploadResponse.data.message);
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message);
    }
  };

  const stopImageCapture = () => {
    console.log("Stopping Image Capture...");
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
    }
  };

  const handleExitGame = () => {
    setIsGameOver(false); // Reset the game over state
    setCounter(0); // Reset the counter
    handleCounter(); // Optionally update the counter if needed
    storingScreenshotsPaths();
    storingImagePaths();
    setCurrentPage('play'); // Move to the play page (instead of 'game')
    // Stop and reset the webcam
    stopImageCapture(); // Stop image capture if any ongoing
    Webcam.reset(); // Reset the webcam to avoid conflicts

    // No need to start the camera here, it will start when entering 'play' page
  };
  const captureScreenshot = () => {
    return new Promise((resolve) => {
      html2canvas(document.body).then((canvas) => {
        const base64Screenshot = canvas.toDataURL('image/png');
        resolve(base64Screenshot);
      });
    });
  };


  const startCamera = () => {
    console.log("Starting camera...");

    const cameraElement = document.getElementById("my_camera");

    // Ensure the DOM element exists
    if (!cameraElement) {
      console.error("Camera element not found!");
      return;
    }

    // Set webcam settings and attach to the element
    Webcam.set({
      width: 320,
      height: 240,
      image_format: 'png',
    });

    Webcam.attach('#my_camera'); // Attach the webcam to the DOM element
    webcamAttached.current = true; // Mark the webcam as attached
    console.log("Camera stream started...");

    captureInterval.current = setInterval(() => {
      if (!isTimeUp && !isGameOver) {
        captureImage();
        captureScreenshot().then((base64Screenshot) => {
          sendScreenshotToServer(base64Screenshot);
        });
      } else {
         stopImageCapture(); // Stop capturing images if game is over or time is up
      }
    }, 10000); // Capture image every 10 seconds
  };
  const sendScreenshotToServer = async (base64Screenshot) => {
    console.log("Uploading Screenshot...");
    console.log("Base64 Screenshot Data:", base64Screenshot); // Log the image data
    try {
      // Create JSON object
      const jsonData = {
        screenshot: base64Screenshot // Send the base64 screenshot data
      };
      console.log("JSON Payload:", jsonData);
      // Make POST request with the base64 screenshot
      const uploadResponse = await axios.post('http://localhost:7000/screenshots', jsonData, {
        headers: {
          'Content-Type': 'application/json', // Specify that it's JSON
        },
      });
      console.log('Screenshot uploaded successfully:', uploadResponse.data.filename);
    } catch (error) {
      console.error('Error uploading screenshot:', error.response ? error.response.data : error.message);
    }
  };
  return (
    <>
      {currentPage === 'login' && (
        <div className="background">
          <div id="loginPage">
            <form id="loginForm" onSubmit={handleLogin}>
              <h1>Login</h1>
              <div className="input-box">
                <label>Username:</label>
                <input
                  id="user"
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-box">
              <label>Password:</label>
              <div className="password-container">
              <input
              type={passwordVisible ? "text" : "password"} // Show password when visible
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
              <span id="togglePassword" className="eye" onClick={togglePasswordVisibility}>
              {/* Show faEyeSlash when the password is visible and faEye when hidden */}
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
              </span>
             </div>
            </div>
              <div className="remember-forgot">
                <label><input type="checkbox" />Remember me</label>
                <button type="button">Forgot Password?</button>
              </div>
              <div className="submit-button">
                <button type="submit" className="button">Login</button>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className="register">
                {/* <p>Don't have an account? <a href='/register'>Register</a></p> */}
                <p>Don't have an account?  <button id='registerid' onClick={handleRegisterClick}>Register</button></p>
              </div>
            </form>
          </div>
        </div>
      )}
      {currentPage === 'register' && (
        < Register setCurrentPage={setCurrentPage} />  // Pass the function to Register component
    )}

      {currentPage === 'play' && (
        <div id="playPage">
          <Navbar />
          <div className="playButton">
            <button type="button" onClick={handlePlayButtonClick}>Play</button>
            <div id="my_camera" style={{ opacity: 0 }}></div>
          </div>
        </div>
      )}

      {currentPage === 'game' && (
        <Game onExit={handleExitGame} />
      )}
    </>
  );
}

export default App;