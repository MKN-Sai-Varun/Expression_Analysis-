import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../CSS/Play.css';
import Webcam from 'webcamjs';
import Navbar from './Home_Navbar.jsx';
import Game from './Game.jsx';
import html2canvas from 'html2canvas';

function Play() {
  const [currentPage, setCurrentPage] = useState('Play');
  const [isGameOver, setIsGameOver] = useState(false);
  const [counter, setCounter] = useState(0);
    // eslint-disable-next-line
  const [isTimeUp, setIsTimeUp] = useState(false);
  const captureInterval = useRef(null);
  const webcamAttached = useRef(false); // To track if webcam is already started
  const screenshotInterval = useRef(null);
  const [cameraStopped, setCameraStopped] = useState(false);
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
  // Start the camera and set up intervals for capturing images and screenshots
const startCamera = () => {
  console.log('Starting camera...');
  const cameraElement = document.getElementById('my_camera');

  if (!cameraElement) {
    console.error('Camera element not found!');
    return;
  }

  // Initialize Webcam
  Webcam.set({
    width: 320,
    height: 240,
    image_format: 'png',
  });

  Webcam.attach('#my_camera');
  webcamAttached.current = true;
  isCapturing = true; // Enable capturing
  setCameraStopped(false); // Mark camera as running

  // Start intervals
  captureInterval.current = setInterval(() => {
    if (isCapturing && !isTimeUp && !isGameOver) {
      captureImage();
    }
  }, 10000);

  screenshotInterval.current = setInterval(() => {
    if (isCapturing && !isTimeUp && !isGameOver) {
      captureScreenshot().then((base64Screenshot) => {
        sendScreenshotToServer(base64Screenshot);
      });
    }
  }, 10000);

  console.log('Camera started with capture intervals.');
};

// Stop the camera and intervals
const stopCamera = async () => {
  if (cameraStopped) {
    console.log('Camera already stopped.');
    return;
  }

  console.log('Stopping camera and clearing intervals...');
  isCapturing = false; // Disable capturing
  setCameraStopped(true); // Mark camera as stopped

  // Clear intervals
  if (captureInterval.current) {
    clearInterval(captureInterval.current);
    captureInterval.current = null;
    console.log('Image capture interval stopped.');
  }
  if (screenshotInterval.current) {
    clearInterval(screenshotInterval.current);
    screenshotInterval.current = null;
    console.log('Screenshot capture interval stopped.');
  }

  storingScreenshotsPaths(); // Store screenshots paths
  storingImagePaths(); // Store image paths

  // Reset webcam
  if (webcamAttached.current) {
    Webcam.reset();
    webcamAttached.current = false;
    console.log('Camera stopped and reset.');
  }
};

// Capture an image
const captureImage = () => {
  if (!isCapturing) return; // Prevent capturing if not active

  console.log('Capturing Image...');
  Webcam.snap((dataUri) => {
    uploadImage(dataUri);
  });
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

// Exit the game and stop the camera
const handleExitGame = () => {
  console.log('Exiting game...');
  stopCamera(); // Stop the camera and intervals
  setIsGameOver(false);
  setCounter(0);
  setCurrentPage('Play'); // Navigate to the play page
};

// Handle Play button click to start the game
const handlePlayButtonClick = async () => {
  console.log('Starting game...');
  setIsGameOver(false); // Reset game state
  setCounter(0); // Reset counter
  handleCounter(); // Update counter
  setCurrentPage('Game'); // Navigate to the game page
  startCamera(); // Start the camera for the new session

  try {
    // Reset server-side variables
    const response = await fetch(process.env.REACT_APP_RESET_VAR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Server-side variables reset successfully.');
    } else {
      console.error('Failed to reset server-side variables.');
    }
  } catch (error) {
    console.error('Error resetting server variables:', error);
    alert('Error connecting to the server.');
  }
};

// Storing relative paths of images
const storingImagePaths = () => {
  console.log("End session of uploads called.");
  fetch(process.env.REACT_APP_IMG_STORE_URL, {
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
const storingScreenshotsPaths = () => {
  console.log("End session of screenshots called.");
  fetch(process.env.REACT_APP_SS_STORE_URL, {
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
let isCapturing = true; // Flag to indicate whether capturing is active
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

const handleGameCompletion = () => {
  console.log('Game completed!');
  setIsGameOver(true);
};


  return (
    <>
      {currentPage === 'Play' && (
        <div id="playButton">
          <Navbar />
          <div className="playButton">
            <button type="button" onClick={handlePlayButtonClick}>Play</button>
            <div id="my_camera" style={{ opacity: 0 }}></div>
          </div>
        </div>
      )}

      {/* {currentPage === 'game' && (
        <Game
          onExit={handleExitGame} // Handles game exit
          onGameComplete={() => {
            stopCamera(); // Stop the camera when the game completes
            handleGameCompletion(); // Handle any additional game completion logic
          }}
        />
      )} */}
      {currentPage === 'Game' && (
        <Game onExit={handleExitGame} onGameComplete={() => {
          stopCamera(); // Stop the camera when the game completes
          handleGameCompletion(); // Handle any additional game completion logic
        }} />
        )}
    </>
  );
}

export default Play;
