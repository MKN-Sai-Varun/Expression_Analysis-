import React, { useState, useRef } from 'react';
import axios from 'axios';
import './styleLoginPlay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'webcamjs';
import Navbar from '../Components/navbar.js';
import Game from '../Components/game.js'; // Import the Game component
import html2canvas from 'html2canvas';
import Register from '../Components/Register.js'; // Import the Register component
// import Home from '../../React(Admin & Analysis)/final/src/Home.jsx';
function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
    // eslint-disable-next-line
  const [role,setRole]=useState('')
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('login');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [counter, setCounter] = useState(0);
    // eslint-disable-next-line
  const [isTimeUp, setIsTimeUp] = useState(false);
  const captureInterval = useRef(null);
  const webcamAttached = useRef(false); // To track if webcam is already started
  const screenshotInterval = useRef(null);
  // Increment counter and send updated count to the server
  const handleCounter = async () => {
    // Increment counter
    const newCounterValue = counter + 1;
    setCounter(newCounterValue);

    try {
      // Send the new counter value to the backend
      await axios.post(process.env.REACT_APP_UPD_CNT_URL, { value: newCounterValue });
      console.log(`Counter updated to ${newCounterValue}`);
    } catch (error) {
      console.error("Error updating counter:", error);
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    setError(''); // Clear any previous error messages
    setLoading(true); // Set loading to true when starting the login
    try {
        const response = await axios.post(process.env.REACT_APP_HANDLE_LOG_URL, {
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
        // alert(`Welcome, ${username}! You have successfully logged in.`);
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
    finally {
      setLoading(false); // Set loading to false after the request completes
    }
};
  // Add a function to handle the Register button click
  const handleRegisterClick = () => {
    setCurrentPage('register');
  };
// Inside the return block
// eslint-disable-next-line
{currentPage === 'register' && (
  <Register setCurrentPage={setCurrentPage} />  // Pass the function to Register component
)}
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
      const response = await fetch(process.env.REACT_APP_RESET_VAR_URL, {
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
 // Start the camera and set up intervals for capturing images and screenshots
 const startCamera = () => {
  console.log('Starting camera...');
  const cameraElement = document.getElementById('my_camera');

  if (!cameraElement) {
    console.error('Camera element not found!');
    return;
  }

  Webcam.set({
    width: 320,
    height: 240,
    image_format: 'png',
  });

  Webcam.attach('#my_camera');
  webcamAttached.current = true;

  captureInterval.current = setInterval(() => {
    if (!isTimeUp && !isGameOver) {
      captureImage();
      captureScreenshot();
    }
  }, 10000); // Capture image every 10 seconds

  screenshotInterval.current = setInterval(() => {
    if (!isTimeUp && !isGameOver) {
      captureScreenshot().then((base64Screenshot) => {
        sendScreenshotToServer(base64Screenshot);
      });
    }
  }, 10000); // Capture screenshot every 10 seconds

  console.log('Camera started with capture intervals.');
};

// Stop the camera and clear all intervals
const stopCamera = () => {
  console.log('Stopping camera and clearing intervals...');
  stopImageCapture();
  stopScreenshotCapture();

  if (webcamAttached.current) {
    Webcam.reset();
    webcamAttached.current = false;
    console.log('Camera stopped and reset.');
  }
};

// Stop image capture interval
const stopImageCapture = () => {
  if (captureInterval.current) {
    clearInterval(captureInterval.current);
    captureInterval.current = null;
    console.log('Image capture stopped.');
  }
};

// Stop screenshot capture interval
const stopScreenshotCapture = () => {
  if (screenshotInterval.current) {
    clearInterval(screenshotInterval.current);
    screenshotInterval.current = null;
    console.log('Screenshot capture stopped.');
  }
};

// Capture an image using the webcam
const captureImage = () => {
  console.log('Capturing Image...');
  Webcam.snap((dataUri) => {
    uploadImage(dataUri);
  });
};

// Upload captured image to the server
const uploadImage = async (base64Image) => {
  console.log('Uploading Image...');
  try {
    const response = await axios.post(process.env.REACT_APP_IMG_SERVER_URL, { image: base64Image });
    console.log('Image uploaded successfully:', response.data.message);
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
  }
};

// Capture a screenshot of the current page
const captureScreenshot = () => {
  return new Promise((resolve) => {
    html2canvas(document.body).then((canvas) => {
      const base64Screenshot = canvas.toDataURL('image/png');
      resolve(base64Screenshot);
    });
  });
};

// Upload captured screenshot to the server
const sendScreenshotToServer = async (base64Screenshot) => {
  console.log('Uploading Screenshot...');
  try {
    const response = await axios.post(process.env.REACT_APP_SS_SERVER_URL, { screenshot: base64Screenshot });
    console.log('Screenshot uploaded successfully:', response.data.filename);
  } catch (error) {
    console.error('Error uploading screenshot:', error.response?.data || error.message);
  }
};

const handleExitGame = () => {
  console.log('Exiting game...');
  setIsGameOver(false);
  setCounter(0);
  stopCamera();  // Stop the camera when exiting the game
  setCurrentPage('play');
};

const handleGameCompletion = () => {
  setIsGameOver(true);  // Mark the game as over
  stopCamera();         // Stop the camera when the game is completed
};


  return (
    <>
    {loading && (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    )}
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
        <Game onExit={handleExitGame} onGameComplete={handleGameCompletion} />
        )}

    </>
  );
}

export default App;