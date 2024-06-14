import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ isEnglish, toggleLanguage, handlePasswordCheck }) {
    return (
        <div id="navBar">
            <div className="login-container">
                <Link to="/LoginPage"><button id="Login-button">{isEnglish ? 'Login' : 'כניסה'}</button></Link>
                <button id="LanguageButton" onClick={toggleLanguage}>
                    {isEnglish ? 'Switch to Hebrew' : 'החלף לאנגלית'}
                </button>
                <button onClick={() => {
                        const enteredPassword = window.prompt("Enter password:");
                        if (enteredPassword) {
                            handlePasswordCheck(enteredPassword);
                        }
                    }}>
                    {isEnglish ? 'Manager' : 'מנהל'}
                </button>
            </div>
        </div>
    );
}


export default NavBar;
