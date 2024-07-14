import React, { useState } from 'react';
import { auth, db } from '../../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './LoginPage.css';
import {  useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const LoginPage = ({ onLogin = () => {} }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();  // Prevent form submission
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
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
      console.error('Error signing in:', error);
      setError('Incorrect email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>כניסת מנהל</h2>
        <form onSubmit={handleLogin} autoComplete="on"> {/* Wrap inputs in a form */}
          <input
            type="email"
            name="email"  // Add name attribute
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            autoComplete="email" // Ensure autoComplete is set
          />
          <input
            type="password"
            name="password"  // Add name attribute
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            autoComplete="current-password" // Ensure autoComplete is set
          />
          <button type="submit" className="login-button">כניסה</button> {/* Set type to submit */}
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func,
};

export default LoginPage;