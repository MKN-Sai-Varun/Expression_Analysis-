import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles1.css';
import parrot from './Assets/parrot.jpg';
import Clion from './Assets/ComputerLion.png';
import lion from './Assets/Lion.png';
import Bear from './Assets/Bear.png';
import CZebra from './Assets/ComputerZebra.png';
import giraffe from './Assets/Giraffe.png';
import horse from './Assets/Horse.png';
import leo from './Assets/Lepord.png';
import skill from './Assets/Skill1.png';
import tiger from './Assets/Tiger.png';
import Zebra from './Assets/Zebra.png';
import { triggerConfetti, stopConfetti } from './Confetti.js';
import ana from './Assets/analysisIcon.png';
import game from './Assets/gameIcon.png';
import line from './Assets/threeLines.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'webcamjs';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [score, setScore] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [cameraActive, setCameraActive] = useState(false);
  const captureInterval = useRef(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = () => {
    setCurrentPage('play');
  };
  

  const handleStartGame = () => {
    console.log("Game Started");
    setScore(0);
    setCurrentPage('question1');
    setTimeLeft(180);
    setIsTimeUp(false); // Reset time up state
    setIsGameOver(false); // Reset game over state
  
    // Clear any existing timer if restarting
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timerRef.current); // Clear the timer when time is up
          setIsTimeUp(true);
          setCurrentPage('TimeUp');
          return 0;
        }
      });
    }, 1000);

    startCamera(); // Start the camera when the game begins
  };

  
  const startCamera = () => {
    console.log("Starting camera...");
    
    Webcam.set({
      width: 320,
      height: 240,
      image_format: 'png',
      jpeg_quality: 90
    });
    
    Webcam.attach('#my_camera');

    console.log("Camera stream started...");

    // Start capturing images every 3 seconds
    captureInterval.current = setInterval(() => {
      if (!isTimeUp && !isGameOver) {
          console.log("setInterval triggered, Attempting to capture image...");
          captureImage();
      } else {
          console.log("Stopping image capture due to game state.");
          stopImageCapture(); // Stop capturing images if game is over or time is up
      }
  }, 5000);
};

  

  const stopImageCapture = () => {
    console.log("Stopping Image Capture...");
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
    }

    

    setCameraActive(false);
    Webcam.reset();
  };

  

  const captureImage = () => {
    console.log("captureImage function called");
    
    Webcam.snap(async (data_uri) => {
      console.log("Capturing Image...");
      console.log("Base64 Image Data Length:", data_uri.length);
      await uploadImage(data_uri); // Send Base64 data directly
    });
  }
  
    

    const uploadImage = async (base64Image) => {
      console.log("Uploading Image...");
      console.log("Base64 Image Data:", base64Image); // Log the image data
      try {
          // Create JSON object
          const jsonData = {
              image: base64Image // Send the base64 image data
          };
          console.log("JSON Payload:", jsonData);
          // Make POST request with the base64 image
          const uploadResponse = await axios.post('http://localhost:5000/uploads', jsonData, {
              headers: {
                  'Content-Type': 'application/json', // Specify that it's JSON
              },
          });
    
          console.log('Image uploaded successfully:', uploadResponse.data.message);
      } catch (error) {
          console.error('Error uploading image:', error.response ? error.response.data : error.message);
      }
    };
    



    useEffect(() => {
      if (isGameOver || isTimeUp) {
        clearInterval(timerRef.current); // Stop the timer when the game is over or time is up
        stopImageCapture();// Stop capturing images
      }
    }, [isGameOver, isTimeUp]);

    const handleGoHome = () => {
      setScore(0);
      stopConfetti();
      setCurrentPage('play');
    };

    const handleChoiceClick = (choice) => {
      if (!submitted) {
        setSelectedChoice(choice);
      }
    };


    const handleButtonClick = async () => {
      try {
          const response = await fetch('http://localhost:5000/trigger-model', {
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
  const handleExitClick = async () => {
    handleButtonClick();
    handleGoHome();
  }

  const handleGetAnalysisClick = async () => {
    handleGoHome();
  }

    const timerRef = useRef(null); // Add a ref to store the timer

    const handleSubmit = () => {
      if (submitted) return;

      if (selectedChoice !== null) {
        setSubmitted(true);

        const correctAnswers = {
          question1: 'p',
          question2: 'Lion',
          question3: 'Skill',
          question4: 'Zebra',
          question5: 'h'
        };

        if (selectedChoice === correctAnswers[currentPage]) {
          setScore(prevScore => prevScore + 1);
        }

        setTimeout(() => {
          if (currentPage === 'question1') setCurrentPage('question2');
          else if (currentPage === 'question2') setCurrentPage('question3');
          else if (currentPage === 'question3') setCurrentPage('question4');
          else if (currentPage === 'question4') setCurrentPage('question5');
          else if (currentPage === 'question5') {
            setCurrentPage('end');
            triggerConfetti();
            setIsGameOver(true);
          }
          setSubmitted(false);
          setSelectedChoice(null);
        }, 1000);
      } else {
        alert('Please select an option!');
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
            transform: 'scale(1.07)'
          };
        }
      }
      return {};
    };

    return (
      <>
        {currentPage === 'login' && (
          <div className="background">
            <div id="loginPage">
              <h1>Login</h1>
              <div className="input-box">
                <label>Username:</label>
                <input type="text" placeholder="Username" />
              </div>
              <div className="input-box">
                <label>Password:</label>
                <div className="password-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                  />
                  <span id="togglePassword" className="eye" onClick={togglePasswordVisibility}>
                    <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                  </span>
                </div>
              </div>
              <div className="remember-forgot">
                <label><input type="checkbox" />Remember me</label>
                <button type="button">Forgot Password?</button>
              </div>
              <div className="submit-button">
                <button type="button" onClick={handleLogin}>Login</button>
              </div>
            </div>
          </div>
        )}


        
        {currentPage === 'play' && (
          <div id="playPage">
            <div className="images">
              <img type="button" className="threeLines" id="image" src={line} alt="Three Lines"></img>
              <img type="button" className="analysisIcon" id="image" src={ana} alt="Analysis Icon"></img>
              <img type="button" className="gameIcon" id="image" src={game} alt="Game Icon"></img>
            </div>
            <div className="playButton">
              <button type="button" onClick={handleStartGame}>Play</button>
              <div id="my_camera" style={{ opacity: 0 }}></div>
            </div>
          </div>
        )}



        {currentPage.startsWith('question') && (
          <div className="timer">
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        )}

       {currentPage === 'question1' && (
        <div id="question1">
          <h1>Q1. Fill in the blank</h1>
          <div className="game">
            <img className="questionImg" src={parrot} alt="Parrot" width="355.1px" />
            <p>_ a r r o t</p>
            <div className="choices">
              <button
                className="choice"
                onClick={() => handleChoiceClick('p')}
                style={getChoiceStyle('p', true)} // Correct answer
              >
                p
              </button>
              <button
                className="choice"
                onClick={() => handleChoiceClick('q')}
                style={getChoiceStyle('q', false)} // Incorrect answer
              >
                q
              </button>
            </div>
          </div>
          <button id="submitButton" className="submit" type="button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

        {currentPage === 'question2' && (
          <div id="question2">
            <h1>Q2. Find The Animal</h1>
            <div className="game">
              <img className="imgQuestion" src={Clion} alt="ComputerLion" />
              <div className="imgChoices">
                <button className="imgchoice" onClick={() => handleChoiceClick('Bear')} style={getChoiceStyle('Bear', false)}>
                  <img src={Bear} alt="Bear" />
                </button>
                <button className="imgchoice" onClick={() => handleChoiceClick('Lion')} style={getChoiceStyle('Lion', true)}>
                  <img src={lion} alt="Lion" />
                </button>
                <button className="imgchoice" onClick={() => handleChoiceClick('Tiger')} style={getChoiceStyle('Tiger', false)}>
                  <img src={tiger} alt="Tiger" />
                </button>
              </div>
            </div>
            <button id="submitButton" className="submit" type="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}

        {currentPage === 'question3' && (
          <div id="question3">
            <h1>Q3. Guess The Word</h1>
            <div className="game">
              <img className="SkillImage" src={skill} width="355.1px" alt="SkillMirrorImage" />
              <div className="choices">
                <button className="choice" onClick={() => handleChoiceClick('Skill')} style={getChoiceStyle('Skill', true)}>
                  Skill
                </button>
                <button className="choice" onClick={() => handleChoiceClick('Silk')} style={getChoiceStyle('Silk', false)}>
                  Silk
                </button>
              </div>
            </div>
            <button id="submitButton" className="submit" type="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}

        {currentPage === 'question4' && (
          <div id="question4">
            <h1>Q4. Find the Animal</h1>
            <div className="game">
              <img src={CZebra} alt="ComputerZebra" />
              <div className="imgChoices">
                <button className="imgchoice" onClick={() => handleChoiceClick('Leopard')} style={getChoiceStyle('Leopard', false)}>
                  <img src={leo} alt="Leopard" />
                </button>
                <button className="imgchoice" onClick={() => handleChoiceClick('Giraffe')} style={getChoiceStyle('Giraffe', false)}>
                  <img src={giraffe} alt="Giraffe" />
                </button>
                <button className="imgchoice" onClick={() => handleChoiceClick('Zebra')} style={getChoiceStyle('Zebra', true)}>
                  <img src={Zebra} alt="Zebra" />
                </button>
              </div>
            </div>
            <button id="submitButton" className="submit" type="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}

        {currentPage === 'question5' && (
          <div id="question5">
            <h1>Q5. Fill in the blank</h1>
            <div className="game">
              <img src={horse} width="355.1px" alt="Horse" />
              <p>_ o r s e</p>
              <div className="choices">
                <button className="choice" onClick={() => handleChoiceClick('n')} style={getChoiceStyle('n', false)}>
                  n
                </button>
                <button className="choice" onClick={() => handleChoiceClick('h')} style={getChoiceStyle('h', true)}>
                  h
                </button>
              </div>
            </div>
            <button id="submitButton" className="submit" type="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}

        {currentPage === 'end' && (
          <div id="endPage">
            <h1>CONGRATULATIONS!</h1>
            <h1>Game Completed</h1>
            <div className="endScore">Score: {score}/5</div>
            <div className="button-container">
              <button className="exit-button" type="button" onClick={handleExitClick}>Exit</button>
              <button className="analysis-button" type="button" onClick={handleGetAnalysisClick}>Get Analysis</button>
            </div>
            {currentPage === 'end'}
          </div>
        )}
        {currentPage === 'TimeUp' && (
          <div id="TimeUpPage">
            <h1>Time's Up</h1>
            <h2>You ran out of time. Game Over</h2>
            <h3>Score: {score}/5</h3>
            <button className="exit-button" type="button" onClick={handleExitClick}>Exit</button>
            <button className="analysis-button" type="button" onClick={handleGetAnalysisClick}>Get Analysis</button>
            {currentPage === 'TimeUp'}
          </div>
        )}
        {(currentPage.startsWith('question')) && (
          <div className="timer">
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        )}
        {currentPage !== 'login' && currentPage !== 'play' && currentPage !== 'end' && currentPage !== 'TimeUp' && (
          <div className="score">
            Score: {score}
          </div>
        )}

      </>
    );
  
}
  export default App;