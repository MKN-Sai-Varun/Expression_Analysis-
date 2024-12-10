import React, { useState} from 'react';
import axios from 'axios';
import './Login_Game.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";

// import Home from '../../React(Admin & Analysis)/final/src/Home.jsx';
function Login_Game() {
  const [username, setUsername] = useState('');//login
  const [password, setPassword] = useState('');//login
  const [error, setError] = useState('');//login
  const [passwordVisible, setPasswordVisible] = useState(false);//login
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    setError(''); // Clear any previous error messages
    setLoading(true);

    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            username,
            password,
        });

        console.log("Login successful!");
        

        const userRole = response.data.role;

        // Show a welcome alert with the username
        

        // Navigate to the appropriate page based on the user role {state:{handlePlayButtonClick}}
        // alert(`Welcome, ${username}! You have successfully logged in.`);
        if (userRole === 'kid') {
            navigate('/Play_Page');//Navigates to the Game Page 
        } else if (userRole === 'admin') {
            navigate('/Admin_Page');//Navigates to the Admin Page
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
            const errorMessage = error.response.data.message;
            setError(errorMessage); // Update the error state to display a message
            alert(errorMessage);    // Show an alert popup with the error message
        } else {
            const serverErrorMessage = 'Server error, please try again later.';
            console.log("Server issue: ",error);
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
    navigate("/Register_Page");
  };


  // Storing relative paths of screenshots
  // useEffect(() => {
  //   if (currentPage === 'play' && !webcamAttached.current) {
  //     startCamera(); // Start the camera when transitioning to the 'play' page
  //   }
  // }, [currentPage]); // Trigger this effect whenever currentPage changes

  return (
    <>
    {loading && (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    )}
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
    </>
  );
}

export default Login_Game;