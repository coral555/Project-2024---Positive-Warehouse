import React from 'react';

function Contact({ isEnglish }) {
    return (
        <div>
            <h1 id='contact'>{isEnglish ? 'Contact: gmail- hhhh.gmail.@.com, 0501111111' : 'יצירת קשר: gmail- hhhh.gmail.@.com, 0501111111' }</h1>
        </div>
    );
}

export default Contact;
