// src/pages/LoginPage.js
import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { auth, db } from '../../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import PropTypes from 'prop-types'; // Import PropTypes

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook


  const handleLogin = async () => {
    setError(''); // Clear previous error
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        // Check if user is authorized
        const userDocRef = doc(db, 'authorizedUsers', user.email);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          onLogin(user.email);
          navigate('/EditInventory');
        } else {
          setError('Unauthorized user');
        }
      }
    } catch (error) {
      console.error('Error signing in:', error); // Log error details
      setError('Incorrect email or password');
    }
  };

  return (
    <div className="login-container-insidLogin">
      <Link to="/" className="back-to-home">
        <button className="back-button">Back to Home</button>
      </Link>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={handleLogin} className="login-button">Login</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

LoginPage.defaultProps = {
  onLogin: () => {},
};

export default LoginPage;
