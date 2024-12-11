import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import './Register.css'; // Ensure the styles are imported
import "./Login_Game.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate=useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

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

        if (username.trim() === '' || password.trim() === '' || role.trim() === '') {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await fetch(process.env.REACT_APP_REG_URL, {
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
                    navigate("/"); // Redirect to login after showing success
                }, 2000);
            } else {
                setError(result.message || 'Registration failed. Please try again.');
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
                        <label htmlFor="username">Username</label>
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
                            <div className="password-input-wrapper">
                                <input
                                    type={passwordVisible ? 'text' : 'password'} // Toggle between 'text' and 'password'
                                    id="password"
                                    name="password"
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <span
                                     className="eye-icon"
                                     onClick={togglePasswordVisibility} // Toggle visibility on click
                                >
                                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>
                    <div className="register-form-group">
                        <div className="register-role-selection">
                            <label class='custom-radio'>
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
                            <label class='custom-radio'>
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
//Done