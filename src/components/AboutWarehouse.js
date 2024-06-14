import React from 'react';
 
function AboutWarehouse({ isEnglish }) {
    return (
        <h1 id="about-warehouse">
            {!isEnglish 
            ? 'אודות המחסן: מערכת לניהול מלאי והזמנות במחסן - הזנת נתונים ומוצרים, ניהול מלאי, ניהול הזמנות ותרומות.' 
            : 'About the warehouse: A system for managing inventory and orders in the warehouse - entering data and products, managing inventory, managing orders and donations.'}
        </h1>
    );
}

export default AboutWarehouse;
