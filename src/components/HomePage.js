import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Button from './Button';
import AboutWarehouse from './AboutWarehouse';
import Contact from './Contact';
import '../styles/page/HomePage.css'; 
import './InventoryPage';

function HomePage() {
    const [isEnglish, setIsEnglish] = useState(true);
    // const navigate = useNavigate();
    // const mngPassword = "1234";
    // const handlePasswordCheck = (password) => {
    //     if (password === mngPassword) {
    //         navigate('/manager');
    //     } else {
    //         alert('Incorrect password'); // Optional: Alert user if the password is incorrect
    //     }
    // };
    const toggleLanguage = () => {
        setIsEnglish(!isEnglish);
    };
    return (
        <div>
            <NavBar isEnglish={isEnglish} toggleLanguage={toggleLanguage} />
            <div id="buttons">
                <Link to="/CreateOrder"><Button text={isEnglish ? 'Create Order' : 'צור הזמנה'} /></Link>
                <Link to="/InventoryPage"><Button text={isEnglish ? 'View Inventory' : 'צפה במלאי'} /></Link>
                <Link to="/Donate"><Button text={isEnglish ? 'Donate' : 'תרומה למחסן'} /></Link>
                <Link to="/manager"><Button text={isEnglish ? 'manager' : 'מנהל'} /></Link>

            </div>
            <AboutWarehouse isEnglish={isEnglish} />
            <Contact isEnglish={isEnglish} />
        </div>
    );
}

export default HomePage;
