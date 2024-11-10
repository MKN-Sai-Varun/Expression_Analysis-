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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'webcamjs';
import html2canvas from 'html2canvas';
import Navbar from './navbar';

function App() {
  const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [score, setScore] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const captureInterval = useRef(null);
  const screenshotInterval = useRef(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); 
  const [counter, setCounter] = useState(0);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    setError(''); // Clear any previous error messages
    try {
        await axios.post('http://localhost:5000/api/auth/login', {
            username,
            password,
        });

        // Optional: You can display a success message here
        setCurrentPage('play'); // Change to play page upon successful login
    } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
            setError(error.response.data.message); // Display error message from server
        } else {
            setError('Server error, please try again later.'); // Handle other errors
        }
    }
};
  const endSession = () => {
    console.log("End session of screenshots called.");
    fetch('http://localhost:4000/end-session', {
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

  const endSession1 = () => {
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

  const handleCounter = async () => {
    // Increment counter
    const newCounterValue = counter + 1;
    setCounter(newCounterValue);

    try {
      // Send the new counter value to the backend
      await axios.post('http://localhost:7000/update-counter', { value: newCounterValue });
      console.log(`Counter updated to ${newCounterValue}`);
    } catch (error) {
      console.error("Error updating counter:", error);
    }
  };
  
  const handlePlayButtonClick = () =>{
    handleCounter();
    handleStartGame();
  }

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

    screenshotInterval.current = setInterval(() => {
      if (!isTimeUp && !isGameOver) {
        captureScreenshot().then((base64Screenshot) => {
          sendScreenshotToServer(base64Screenshot);
        });
      } 
       
    }, 10000); // Every 5 seconds

    startCamera(); // Start the camera when the game begins
  };

  const captureScreenshot = () => {
    return new Promise((resolve) => {
      html2canvas(document.body).then((canvas) => {
        const base64Screenshot = canvas.toDataURL('image/png');
        resolve(base64Screenshot);
      });
    });
  };

  const stopScreenshotCapture = () => {
    console.log("Stopping Screenshot Capture...");
    
    // Stop capturing screenshots if interval exists
    if (screenshotInterval.current) {
        clearInterval(screenshotInterval.current);
        screenshotInterval.current = null; // Clear reference
    }
    console.log("Screenshot capture stopped.");
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
      const uploadResponse = await axios.post('http://localhost:4000/screenshots', jsonData, {
        headers: {
          'Content-Type': 'application/json', // Specify that it's JSON
        },
      });
      console.log('Screenshot uploaded successfully:', uploadResponse.data.filename);
    } catch (error) {
      console.error('Error uploading screenshot:', error.response ? error.response.data : error.message);
    }
  };
  
  const startCamera = () => {
    console.log("Starting camera...");
    Webcam.set({
      width: 320,
      height: 240,
      image_format: 'png',
      
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
  }, 10000);
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
          const uploadResponse = await axios.post('http://localhost:7000/uploads', jsonData, {
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
        stopScreenshotCapture();
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
  const handleExitClick = async () => {
    handleButtonClick();
    handleGoHome();
    endSession();
    endSession1();
  }

    const timerRef = useRef(null); // Add a ref to store the timer
    const correctAnswers = {
      question1: 'p',
      question2: 'Lion',
      question3: 'Skill',
      question4: 'Zebra',
      question5: 'h'
    };
  
    const handleSubmit = () => {
      if (selectedChoice === null) {
        alert('Please select an option!');
        return;
      }
    
      // Update score if the answer is correct
      const isCorrect = selectedChoice === correctAnswers[currentPage];
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }
      // Mark the question as submitted
      setSubmitted(true);
    };
    
    const handleNext = () => {
      // Move to the next question only if the current question has been submitted
      if (submitted) {
        if (currentPage === 'question1') setCurrentPage('question2');
        else if (currentPage === 'question2') setCurrentPage('question3');
        else if (currentPage === 'question3') setCurrentPage('question4');
        else if (currentPage === 'question4') setCurrentPage('question5');
        else if (currentPage === 'question5') {
          setCurrentPage('end');
          triggerConfetti(); // Assuming you have this function defined
          setIsGameOver(true); // Assuming this state is defined
        }
        // Reset state for the next question
        setSelectedChoice(null);
        setHasSubmitted(false);
        setSubmitted(false); // Reset submitted state for the next question
      }
    };
    
    const getChoiceStyle = (choice, isCorrect) => {
      if (selectedChoice === choice) {
        if (submitted) {
          return {
            border: `7px solid ${isCorrect ? 'green' : 'red'}`,
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
              <form id="loginForm">
              <h1>Login</h1>
              <div className="input-box">
                <label>Username:</label>
                <input id="user" type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
              </div>
              <div className="input-box">
              <label>Password:</label>
                <div className="password-container">
                  <input type={passwordVisible ? "text" : "password"} id="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
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
                <button type="button" onClick={handleLogin} class="button">Login</button>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div class="register">
                <p>Don't have an account?  <a href='/register'>Register</a></p>
              </div>
              <p id="message"></p>
              </form>
            </div>
          </div>
        )}

        {currentPage === 'play' && (
          <div id="playPage">
            <div className="images">
            <Navbar />
            </div>
            <div className="playButton">
              <button type="button" onClick={handlePlayButtonClick}>Play</button>
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
            <img className="questionImg" src={parrot} alt="Parrot" height="315px"/>
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
          {/* <button id="submitButton" className="submit" type="button" onClick={handleSubmit}>
            Submit
          </button> */}
          <button id="submitButton" className="submit" type="button" onClick={submitted ? handleNext : handleSubmit}>
  {submitted ? 'Next' : 'Submit'}
</button>

        </div>
      )}
        {currentPage === 'question2' && (
          <div id="question2">
            <h1>Q2. Find The Animal</h1>
            <div className="game">
              <img className="questionImg" src={Clion} alt="ComputerLion" />
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
            <button id="submitButton" className="submit" type="button" onClick={submitted ? handleNext : handleSubmit}>
              {submitted ? 'Next' : 'Submit'}
            </button>

          </div>
        )}

        {currentPage === 'question3' && (
          <div id="question3">
            <h1>Q3. Guess The Word</h1>
            <div className="game">
              <img className="SkillImage" src={skill} width="355.1px" alt="SkillImage" />
              <div className="choices">
                <button className="choice" onClick={() => handleChoiceClick('Skill')} style={getChoiceStyle('Skill', true)}>
                  Skill
                </button>
                <button className="choice" onClick={() => handleChoiceClick('Silk')} style={getChoiceStyle('Silk', false)}>
                  Silk
                </button>
              </div>
            </div>
            <button id="submitButton" className="submit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Next' : 'Submit'}
            </button>

          </div>
        )}

        {currentPage === 'question4' && (
          <div id="question4">
            <h1>Q4. Find the Animal</h1>
            <div className="game">
              <img className="questionImg" src={CZebra} alt="ComputerZebra" />
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
            <button id="submitButton" className="submit" type="button" onClick={submitted ? handleNext : handleSubmit}>
              {submitted ? 'Next' : 'Submit'}
            </button>

          </div>
        )}

        {currentPage === 'question5' && (
          <div id="question5">
            <h1>Q5. Fill in the blank</h1>
            <div className="game">
              <img className="questionImg" src={horse} width="355.1px" alt="Horse" />
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
            <button id="submitButton" className="submit" type="button" onClick={() => {
    if (submitted) {
      handleNext();
    } else {
      handleSubmit();
    }
  }}
              >
              {submitted ? 'Submit' : 'Submit'}
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