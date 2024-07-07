import React from 'react';
import { Link } from 'react-router-dom';
import './AboutWarehouse.css';
import teamMember1 from '../../assets/images/Tami Kalman.jpg'; // Replace with actual paths
import teamMember2 from '../../assets/images/pazit.jpg';
import teamMember3 from '../../assets/images/logo.jpg';
import teamMember4 from '../../assets/images/asi.jpg';
import teamMember5 from '../../assets/images/kahatiya.jpg';
import teamMember6 from '../../assets/images/elad.jpg';
import teamMember7 from '../../assets/images/doodi.jpeg';
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

            <div className="teamSection">
                <h1>צוות המחסן שלנו</h1>
                <div className="teamGrid">
                    <div className="teamMember">
                        <img src={teamMember1} alt="Team Member 1" />
                        <h2>תמי קלמן</h2>
                    </div>
                    <div className="teamMember">
                        <img src={teamMember2} alt="Team Member 2" />
                        <h2>פזית ורדי</h2>
                    </div>
                    <div className="teamMember">
                        <img src={teamMember3} alt="Team Member 3" />
                        <h2>מוטי כהן</h2>
                    </div>
                    <div className="teamMember">
                        <img src={teamMember4} alt="Team Member 4" />
                        <h2>אסי ברוש</h2>
                    </div>
                    <div className="teamMember">
                        <img src={teamMember5} alt="Team Member 5" />
                        <h2>כהתיה דרורי</h2>
                    </div>
                    <div className="teamMember">
                        <img src={teamMember6} alt="Team Member 6" />
                        <h2>אלעד לוי</h2>
                    </div>
                    <div className="teamMember">
                        <img src={teamMember7} alt="Team Member 7" />
                        <h2>דודי אלאלוף</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutWarehouse;
