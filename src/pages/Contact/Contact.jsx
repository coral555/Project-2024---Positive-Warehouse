import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

import contactImage1 from '../../assets/images/Tami Kalman.jpg'; // Replace with actual paths
import contactImage2 from '../../assets/images/pazit.jpg';
import contactImage3 from '../../assets/images/logo.jpg';
import contactImage4 from '../../assets/images/asi.jpg';
import contactImage5 from '../../assets/images/kahatiya.jpg';
import contactImage6 from '../../assets/images/elad.jpg';
import contactImage7 from '../../assets/images/doodi.jpeg';

function Contact() {
    return (
        <div className="contactPage">
        <div>
            <div className="contactBanner">
                <div className="bannerContent">
                    <h1>תרומה למחסן</h1>
                    <p><Link to="/Donate">תרומה</Link></p>
                    <p><Link to="/Donate">דף הבית</Link> </p>

                </div>
            </div>


            <div className="contactSection">
                <div className="contactDetails">
                    <div className="contactPerson">
                        <img src={contactImage1} alt="Contact 1" />
                        <div>
                            <h3>תמי קלמן</h3>
                            <p><i className="fas fa-phone"></i> 054 - 6274669</p>
                        </div>
                    </div>
                    <div className="contactPerson">
                        <img src={contactImage2} alt="Contact 2" />
                        <div>
                            <h3>פזית ורדי</h3>
                            <p><i className="fas fa-phone"></i> 054 - 6700721</p>
                        </div>
                    </div>
                    <div className="contactPerson">
                        <img src={contactImage3} alt="Contact 3" />
                        <div>
                            <h3>מוטי כהן</h3>
                            <p><i className="fas fa-phone"></i> 050 - 5994488</p>
                        </div>
                    </div>
                    <div className="contactPerson">
                        <img src={contactImage4} alt="Contact 4" />
                        <div>
                            <h3>אסי ברוש</h3>
                            <p><i className="fas fa-phone"></i> 052 - 8522668</p>
                        </div>
                    </div>
                    <div className="contactPerson">
                        <img src={contactImage5} alt="Contact 5" />
                        <div>
                            <h3>כהתיה דרורי</h3>
                            <p><i className="fas fa-phone"></i> 054 - 5250219</p>
                        </div>
                    </div>
                    <div className="contactPerson">
                        <img src={contactImage6} alt="Contact 6" />
                        <div>
                            <h3>אלעד לוי</h3>
                            <p><i className="fas fa-phone"></i> 050 - 7942849</p>
                        </div>
                    </div>
                    <div className="contactPerson">
                        <img src={contactImage7} alt="Contact 7" />
                        <div>
                            <h3>דודי אלאלוף</h3>
                            <p><i className="fas fa-phone"></i> 678-901-2345</p>
                        </div>
                    </div>
                </div>

                <div className="contactEmail">
                    <h2>Contact Email</h2>
                    <p><i className="fas fa-envelope"></i>postivestorage@gmail.com</p>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Contact;
