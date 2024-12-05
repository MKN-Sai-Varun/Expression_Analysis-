import React, { useState, useEffect, useRef } from 'react';
import './styleGame.css';
import image from '../Assets/images.js';
import { triggerConfetti, stopConfetti } from '../Components/Confetti.js';
import Webcam from 'webcamjs';

function Game({ onExit , onGameComplete}) { // Accept onExit as a prop
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPage, setCurrentPage] = useState('question1');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // or any initial value you need
  // eslint-disable-next-line
  const [cameraActive, setCameraActive] = useState(false);
  const captureInterval = useRef(null);
  const screenshotInterval = useRef(null);
  const timerRef = useRef(null);
  const correctAnswers = {
    question1: 'p',
    question2: 'Lion',
    question3: 'Skill',
    question4: 'Zebra',
    question5: 'h',
  };

  // Handle selection of an answer choice
  const handleChoiceClick = (choice) => {
    if (!submitted) {
      setSelectedChoice(choice);
    }
  };

  // Handle the display after an option is selected
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

  // Check the selected answer and update score accordingly
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

  // Navigate to the next question after submission
  const handleNext = () => {
    if (submitted) {
      if (currentPage === 'question1') setCurrentPage('question2');
      else if (currentPage === 'question2') setCurrentPage('question3');
      else if (currentPage === 'question3') setCurrentPage('question4');
      else if (currentPage === 'question4') setCurrentPage('question5');
      else if (currentPage === 'question5') {
        setCurrentPage('end');
        triggerConfetti();
        setIsGameOver(true); // Set game over state
      }
      setSelectedChoice(null);
      setSubmitted(false);
    }
  };

  // Reset game state to allow starting a new game
  const handleExitClick = () => {
    stopConfetti();
    setScore(0);
    if (onExit) onExit(); // Call the onExit prop function
  };

  // Stop capturing images
  const stopImageCapture = () => {
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
    }
    setCameraActive(false);
    Webcam.reset();
  };

  // Stop capturing screenshots
  const stopScreenshotCapture = () => {
    if (screenshotInterval.current) {
      clearInterval(screenshotInterval.current);
      screenshotInterval.current = null;
    }
  };

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

  useEffect(() => {
    if (currentPage === 'end' && onGameComplete) {
      onGameComplete(); // Call the parent function when game is over
    }
  }, [currentPage, onGameComplete]);

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
          <div className="game">
            <img className="questionImg" src={image.parrot} alt="Parrot" height="315px" />
            <p>_ a r r o t</p>
            <div className="choices">
              <button
                className="choice"
                onClick={() => handleChoiceClick('p')}
                style={getChoiceStyle('p', true)}
              >
                p
              </button>
              <button
                className="choice"
                onClick={() => handleChoiceClick('q')}
                style={getChoiceStyle('q', false)}
              >
                q
              </button>
            </div>
          </div>
          <button className="submit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Next' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'question2' && (
        <div id="question2">
          <h1>Q2. Find The Animal</h1>
          <div className="game">
            <img className="questionImg" src={image.Clion} alt="Lion" />
            <div className="imgChoices">
              <button className="imgchoice" onClick={() => handleChoiceClick('Bear')} style={getChoiceStyle('Bear', false)}>
                <img src={image.bear} alt="Bear" />
              </button>
              <button className="imgchoice" onClick={() => handleChoiceClick('Lion')} style={getChoiceStyle('Lion', true)}>
                <img src={image.lion} alt="Lion" />
              </button>
              <button className="imgchoice" onClick={() => handleChoiceClick('Tiger')} style={getChoiceStyle('Tiger', false)}>
                <img src={image.tiger} alt="Tiger" />
              </button>
            </div>
          </div>
          <button className="submit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Next' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'question3' && (
        <div id="question3">
          <h1>Q3. Guess The Word</h1>
          <div className="game">
            <img className="SkillImage" src={image.skill} width="355.1px" alt="SkillImage" />
            <div className="choices">
              <button className="choice" onClick={() => handleChoiceClick('Skill')} style={getChoiceStyle('Skill', true)}>
                Skill
              </button>
              <button className="choice" onClick={() => handleChoiceClick('Silk')} style={getChoiceStyle('Silk', false)}>
                Silk
              </button>
            </div>
          </div>
          <button className="submit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Next' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'question4' && (
        <div id="question4">
          <h1>Q4. Find the Animal</h1>
          <div className="game">
            <img className="questionImg" src={image.Czebra} alt="Zebra" />
            <div className="imgChoices">
              <button className="imgchoice" onClick={() => handleChoiceClick('Leopard')} style={getChoiceStyle('Leopard', false)}>
                <img src={image.leapord} alt="Leopard" />
              </button>
              <button className="imgchoice" onClick={() => handleChoiceClick('Giraffe')} style={getChoiceStyle('Giraffe', false)}>
                <img src={image.giraffe} alt="Giraffe" />
              </button>
              <button className="imgchoice" onClick={() => handleChoiceClick('Zebra')} style={getChoiceStyle('Zebra', true)}>
                <img src={image.zebra} alt="Zebra" />
              </button>
            </div>
          </div>
          <button className="submit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Next' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'question5' && (
        <div id="question5">
          <h1>Q5. Fill in the blank</h1>
          <div className="game">
            <img className="questionImg" src={image.horse} width="355.1px" alt="Horse" />
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
          <button className="submit" type="button" onClick={submitted ? handleNext : handleSubmit}>
            {submitted ? 'Exit' : 'Submit'}
          </button>
        </div>
      )}
      {currentPage === 'end' && (
          <div id="endPage" className='page-container'>
            <h1>CONGRATULATIONS!</h1>
            <h1>Game Completed</h1>
            <div className="endScore">Score: {score}/5</div>
            <button className="exit-button" type="button" onClick={handleExitClick}>Exit
            </button>
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
    </>
  );
}

export default Game; 