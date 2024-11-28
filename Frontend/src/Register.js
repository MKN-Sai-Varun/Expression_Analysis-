import React, { useState } from 'react';
import './styleRegister.css'; // Ensure the styles are imported

function Register({ setCurrentPage }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    // Define the change handlers
    const handleUsernameChange = (e) => {
      setUsername(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const handleRoleChange = (e) => {
      setRole(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, role }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          setSuccess(result.message || 'User registered successfully!');
          setError('');
          setTimeout(() => {
            setCurrentPage('login');  // After success, go to login
          }, 2000); // Delay to show success message
        } else {
          setError(result.message || 'Registration failed');
          setSuccess('');
        }
      } catch (error) {
        console.error('Network error during registration:', error);
        setError('There was an error with the registration process.');
        setSuccess('');
      }
    };  
  return (
    <div className="register-page-container">
      <div className="register-form-container">
        <h2 className="register-form-title">Register</h2>
        <form id="registrationForm" onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label htmlFor="username">Name</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="register-form-group">
            <div className="register-role-selection">
              <label>
                <input
                  type="radio"
                  id="adminRadio"
                  name="role"
                  value="admin"
                  required
                  checked={role === 'admin'}
                  onChange={handleRoleChange}
                />
                I am an admin
              </label>
              <label>
                <input
                  type="radio"
                  id="kidRadio"
                  name="role"
                  value="kid"
                  required
                  checked={role === 'kid'}
                  onChange={handleRoleChange}
                />
                I am a kid
              </label>
            </div>
          </div>
          <div className="register-form-group">
            <input type="submit" value="Register Now" className="register-submit-button" />
          </div>
        </form>
        {error && <p className="register-error-message">{error}</p>}
        {success && <p className="register-success-message">{success}</p>}
      </div>
    </div>
  );
}

export default Register;
