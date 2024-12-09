import React, { useState, useEffect, useRef } from 'react';
import "./Game.css";
import image from './image.js';
import {useNavigate} from "react-router-dom";
import { triggerConfetti, stopConfetti } from './Confetti.js';
import Webcam from 'webcamjs';
import html2canvas from 'html2canvas';
import axios from 'axios';
function Game() { // Accept onExit as a prop
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPage, setCurrentPage] = useState('question1');
  const [timeLeft, setTimeLeft] = useState(180); // or any initial value you need
  const [cameraActive, setCameraActive] = useState(false);
  const screenshotInterval = useRef(null);
  const timerRef = useRef(null);
  const navigate=useNavigate();
  const correctAnswers = {
    question1: 'p',
    question2: 'Lion',
    question3: 'Skill',
    question4: 'Zebra',
    question5: 'h',
  };
  const [isGameOver, setIsGameOver] = useState(false);//Game
  const [counter, setCounter] = useState(0);//Game
  const [isTimeUp, setIsTimeUp] = useState(false);//Game
  const captureInterval = useRef(null);//Game
  const webcamAttached = useRef(false); // To track if webcam is already started

  const handleChoiceClick = (choice) => {
    if (!submitted) {
      setSelectedChoice(choice);
    }
  };
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
    //handleCounter(); // Optionally update the counter if needed
    storingScreenshotsPaths();
    storingImagePaths();
    navigate("/Play_Page"); // Move to the play page (instead of 'game')
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
  const getChoiceStyle = (choice, isCorrect) => {
    if (selectedChoice === choice) {
      if (submitted) {
        return {
          border: `5px solid ${isCorrect ? 'green' : 'red'}`,
          backgroundColor: isCorrect ? 'green' : 'red',
          color: 'white',
        };
      } else {
        return {
          border: '3px solid blue',
          transform: 'scale(1.07)',
        };
      }
    }
    return {};
  };

  const handleSubmit = () => {
    if (selectedChoice === null) {
      alert('Please select an option!');
      return;
    }

    const isCorrect = selectedChoice === correctAnswers[currentPage];
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setSubmitted(true);
  };

  const handleNext = () => {
    if (submitted) {
      if (currentPage === 'question1') setCurrentPage('question2');
      else if (currentPage === 'question2') setCurrentPage('question3');
      else if (currentPage === 'question3') setCurrentPage('question4');
      else if (currentPage === 'question4') setCurrentPage('question5');
      else if (currentPage === 'question5') {
        setCurrentPage('end');
        triggerConfetti();
        setIsGameOver(true);
      }
      setSelectedChoice(null);
      setSubmitted(false);
    }
  };

  const handleExitClick = () => {
    stopConfetti();
    setScore(0); 
    handleExitGame();
  };

  const stopScreenshotCapture = () => {
    if (screenshotInterval.current) {
      clearInterval(screenshotInterval.current);
      screenshotInterval.current = null;
    }
  };
  useEffect(() => {
    const initialize = async () => {
      setIsGameOver(false); // Reset game over state
      setCounter(0); // Reset counter
      handleCounter(); // Update counter
      startCamera();
      // Start the camera only if it hasn't been started yet
      if (!webcamAttached.current) {
        startCamera();
        webcamAttached.current = true;
      }
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
  
    initialize();
  }, []);
  useEffect(() => {
    if (isGameOver || isTimeUp) {
      clearInterval(timerRef.current);
      stopImageCapture();
      stopScreenshotCapture();
    }
  }, [isGameOver, isTimeUp]);

  useEffect(() => {
    if (currentPage.startsWith('question')) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timerRef.current);
            setIsTimeUp(true);
            setCurrentPage('TimeUp');
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentPage]);

  return (
    <>
    {currentPage.startsWith('question') && (
  <div className="status">
    <div className="timer">
      Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
    </div>
    <div className="score">
      Score: {score}
    </div>
  </div>
)}

      {currentPage === 'question1' && (
        <div id="question1">
          <h1>Q1. Fill in the blank</h1>
          <div className="gameLayout">
            <img className="questionImg" src={image.parrot} alt="Parrot" height="315px" />
            <p>_ a r r o t</p>
            <div className="choicesButtons">
              <button
                className="choiceButton"
                onClick={() => handleChoiceClick('p')}
                style={getChoiceStyle('p', true)}
              >
                p
              </button>
              <button
                className="choiceButton"
                onClick={() => handleChoiceClick('q')}
                style={getChoiceStyle('q', false)}
              >
                q
              </button>
            </div>
          </div>
          <button className="answerSubmit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Next' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'question2' && (
        <div id="question2">
          <h1>Q2. Find The Animal</h1>
          <div className="gameLayout">
            <img className="questionImg" src={image.Clion} alt="Lion" />
            <div className="choicesImages">
              <button className="choiceImage" onClick={() => handleChoiceClick('Bear')} style={getChoiceStyle('Bear', false)}>
                <img src={image.Bear} alt="Bear" />
              </button>
              <button className="choiceImage" onClick={() => handleChoiceClick('Lion')} style={getChoiceStyle('Lion', true)}>
                <img src={image.lion} alt="Lion" />
              </button>
              <button className="choiceImage" onClick={() => handleChoiceClick('Tiger')} style={getChoiceStyle('Tiger', false)}>
                <img src={image.tiger} alt="Tiger" />
              </button>
            </div>
          </div>
          <button className="answerSubmit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Next' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'question3' && (
        <div id="question3">
          <h1>Q3. Guess The Word</h1>
          <div className="gameLayout">
            <img className="SkillImage" src={image.skill} width="355.1px" alt="SkillImage" />
            <div className="choicesButtons">
              <button className="choiceButton" onClick={() => handleChoiceClick('Skill')} style={getChoiceStyle('Skill', true)}>
                Skill
              </button>
              <button className="choiceButton" onClick={() => handleChoiceClick('Silk')} style={getChoiceStyle('Silk', false)}>
                Silk
              </button>
            </div>
          </div>
          <button className="answerSubmit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Next' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'question4' && (
        <div id="question4">
          <h1>Q4. Find the Animal</h1>
          <div className="gameLayout">
            <img className="questionImg" src={image.CZebra} alt="Zebra" />
            <div className="choicesImages">
              <button className="choiceImage" onClick={() => handleChoiceClick('Leopard')} style={getChoiceStyle('Leopard', false)}>
                <img src={image.leo} alt="Leopard" />
              </button>
              <button className="choiceImage" onClick={() => handleChoiceClick('Giraffe')} style={getChoiceStyle('Giraffe', false)}>
                <img src={image.giraffe} alt="Giraffe" />
              </button>
              <button className="choiceImage" onClick={() => handleChoiceClick('Zebra')} style={getChoiceStyle('Zebra', true)}>
                <img src={image.Zebra} alt="Zebra" />
              </button>
            </div>
          </div>
          <button className="answerSubmit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Next' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'question5' && (
        <div id="question5">
          <h1>Q5. Fill in the blank</h1>
          <div className="gameLayout">
            <img className="questionImg" src={image.horse} width="355.1px" alt="Horse" />
            <p>_ o r s e</p>
            <div className="choicesButtons">
              <button className="choiceButton" onClick={() => handleChoiceClick('n')} style={getChoiceStyle('n', false)}>
                n
              </button>
              <button className="choiceButton" onClick={() => handleChoiceClick('h')} style={getChoiceStyle('h', true)}>
                h
              </button>
            </div>
          </div>
          <button className="answerSubmit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Exit' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'end' && (
          <div id="endPage" className='page-container'>
            <h1>CONGRATULATIONS!</h1>
            <h1>Game Completed</h1>
            <div className="totalScore">Score: {score}/5</div>
            <div className="buttonContainer">
            <button className="exitButton" type="button" onClick={handleExitClick}>Exit
            </button>
            </div>
            {currentPage === 'end'}
          </div>
        )}
        {currentPage === 'TimeUp' && (
          <div id="TimeUpPage" className='page-container'>
            <h1>Time's Up</h1>
            <h2>You ran out of time. Game Over</h2>
            <h3>Score: {score}/5</h3>
            <button className="exit-button" type="button" onClick={handleExitClick}>Exit</button>
            {currentPage === 'TimeUp'}
          </div>
        )}
        <div id="my_camera" style={{ display: 'none' }}></div>
    </>
  );
}

export default Game; 