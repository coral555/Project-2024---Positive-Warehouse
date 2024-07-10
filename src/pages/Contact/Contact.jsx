import React from 'react';
import './Contact.css';
import phoneIcon from "../../assets/images/phone.jpg";

function Contact() {
    return (
        <div className="contact-page">
            <h1 className="page-title">צור קשר</h1>
            <div className="contact-form-container">
                <div className="details-bar-wrapper">
                    <div className="text-wrapper">
                        <p className="text-one">דרכי התקשרות</p>
                        <p className="text-two">לתיאום זמני הגעה לאיסוף ההזמנה יש ליצור קשר עמנו</p>
                        <p className="text-two">עבור הזמנות שכללו מוצרים בתשלום (מקרן/בידורית), יש לשלם תחילה 50 ש"ח דרך פייבוקס</p>

                    </div>
                    <div className="contact-email">
                        <p className="text-one">אימייל ליצירת קשר</p>
                        <p className="text-two">postivestorage@gmail.com</p>
                    </div>
                </div>
                <div className="contact-section">
                    <div className="column">
                        <div className="contact-person">
                            <h2>
                                <img src={phoneIcon} alt="Phone icon" className="phone-icon" />
                                תמי קלמן
                            </h2>
                            <h4>054 - 6274669</h4>
                        </div>
                        <div className="contact-person">
                            <h2>
                                <img src={phoneIcon} alt="Phone icon" className="phone-icon" />
                                פזית ורדי
                            </h2>
                            <h4>054 - 6700721</h4>
                        </div>
                        <div className="contact-person">
                            <h2>
                                <img src={phoneIcon} alt="Phone icon" className="phone-icon" />
                                מוטי כהן
                            </h2>
                            <h4>050 - 5994488</h4>
                        </div>
                    </div>
                    <div className="column">
                        <div className="contact-person">
                            <h2>
                                <img src={phoneIcon} alt="Phone icon" className="phone-icon" />
                                אסי ברוש
                            </h2>
                            <h4>052 - 8522668</h4>
                        </div>
                        <div className="contact-person">
                            <h2>
                                <img src={phoneIcon} alt="Phone icon" className="phone-icon" />
                                כהתיה דרורי
                            </h2>
                            <h4>054 - 5250219</h4>
                        </div>
                        <div className="contact-person">
                            <h2>
                                <img src={phoneIcon} alt="Phone icon" className="phone-icon" />
                                אלעד לוי
                            </h2>
                            <h4>050 - 7942849</h4>
                        </div>
                        <div className="contact-person">
                            <h2>
                                <img src={phoneIcon} alt="Phone icon" className="phone-icon" />
                                דודי אלאלוף
                            </h2>
                            <h4>053 - 4256567</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
