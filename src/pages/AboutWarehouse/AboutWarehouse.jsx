import React from 'react';
import { Link } from 'react-router-dom';
import './AboutWarehouse.css';
import about from '../../assets/images/about.jpg';


function AboutWarehouse() {
    return (
        <div className="aboutPage">
            <div className="aboutUsBanner">
                <div className="bannerContent">
                    <h1>?מי אנחנו</h1>
                    <p><Link to="/"> דף הבית</Link> -&gt; מי אנחנו</p>
                </div>
            </div>

            <div className="aboutSection">
                <h1>מחסן חיובי</h1>            
                <img src={about} alt="about" className="about" />
            </div>
        </div>
    );
}

export default AboutWarehouse;
