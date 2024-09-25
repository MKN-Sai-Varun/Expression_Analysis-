import React, { useState} from 'react';
import './styles1.css';
import parrot from './Assets/parrot.jpg';
import Clion from './Assets/ComputerLion.png';
import lion from './Assets/Lion.png';
import Bear from './Assets/Bear.png';
import CZebra from './Assets/ComputerZebra.png';
import giraffe from './Assets/Giraffe.png';
import horse from './Assets/Horse.png';
import leo from './Assets/Lepord.png';
import skill from './Assets/SkillMirrorImage.png';
import tiger from './Assets/Tiger.png';
import Zebra from './Assets/Zebra.png';
import { triggerConfetti, stopConfetti} from './Confetti.js'; // Import the confetti function
import ana from './Assets/analysisIcon.png';
import game from './Assets/gameIcon.png';
import line from './Assets/threeLines.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // 3 minutes
  const [score, setScore] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false)

const togglePasswordVisibility = () => {
  setPasswordVisible(!passwordVisible);
};

  const handleLogin = () => {
    setCurrentPage('play');
  };
  const handleStartGame = () => {
    setScore(0);
    setCurrentPage('question1');
    setTimeLeft(5); // Set 3 minutes (180 seconds)
  
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          setCurrentPage('TimeUp');
          return 0;
        }
      });
    }, 1000);
  };
  
  const handleGoHome = () => {
    stopConfetti(); // Stop the confetti
    setCurrentPage('play'); // Navigate back to play
  };

  const handleChoiceClick = (choice) => {
    if (!submitted) {
      setSelectedChoice(choice);
    }
  };

  const handleSubmit = () => {
    if (submitted) return; // Prevent further submissions if already submitted

    if (selectedChoice !== null) {
        setSubmitted(true);

        // Determine if the selected answer is correct
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

        // Move to the next question after 1 second
        setTimeout(() => {
            if (currentPage === 'question1') setCurrentPage('question2');
            else if (currentPage === 'question2') setCurrentPage('question3');
            else if (currentPage === 'question3') setCurrentPage('question4');
            else if (currentPage === 'question4') setCurrentPage('question5');
            else if (currentPage === 'question5') {
                setCurrentPage('end');
                triggerConfetti();
            }
            setSubmitted(false); // Allow new submission for next question
            setSelectedChoice(null); // Reset the selection for the next question
        }, 1000);
    } else {
        alert('Please select an option!');
    }
};

  const getChoiceStyle = (choice, isCorrect) => {
    if (selectedChoice === choice) {
      if (submitted) {
        return {
          border: `7px solid ${isCorrect ? 'green' : 'red'}`, // Green for correct, red for incorrect
          backgroundColor: isCorrect ? 'green' : 'red',
          color: 'white',
        };
      } else {
        return {
          border: '3px solid blue', // Highlight selected choice
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
          <img className="threeLines" id="image" src={line} alt="Three Lines" />
          <img className="analysisIcon" id="image" src={ana} alt="Analysis Icon" />
          <img className="gameIcon" id="image" src={game} alt="Game Icon" />
          </div>
          <div className="playButton">
            <button type="button" onClick={handleStartGame}>Play</button>
          </div>
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
            <img className="image" src={skill} width="355.1px" alt="SkillMirrorImage" />
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
                <button class = "home-button" type="button" onClick={handleGoHome}>Home</button>
                {currentPage === 'end'}
                </div>
              )}
              {currentPage === 'TimeUp' && (
            <div id="TimeUpPage">
                <h1>Time's Up</h1>
                <h2>You ran out of time. Game Over</h2>
                <h3>Score: {score}/5</h3>
                <button class = "home-button" type="button" onClick={handleGoHome}>Home</button>
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
export default App