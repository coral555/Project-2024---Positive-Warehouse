import React from 'react';
import { Link } from 'react-router-dom';
import './Donate.css';

import payboxLogo from '../../assets/images/PayBox logo.png'; // adjust the path if necessary

function Donate() {
    return (
        <div>
            <div className="donateBanner">
                <div className="bannerContent">
                    <h1>תרומה למחסן</h1>
                    <p><Link to="/">דף הבית</Link> -&gt; תרומה למחסן</p>
                </div>
            </div>
            <div className="donateSection">
            <form  className="donateContent">
                    <a href="https://payboxapp.page.link/ByZyKCSDAWy7Y4eL9" target="_blank" rel="noopener noreferrer">
                        <img src={payboxLogo} alt="PayBox Logo" className="payboxLogo" />
                        <p>Click here to donate via PayBox</p>
                    </a>
                    </form>
            </div>
        </div>
    );
}

export default Donate;
