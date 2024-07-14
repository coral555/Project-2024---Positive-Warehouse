import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onSubmit, userInfo, setUserInfo }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  if (!isOpen) {
    return null; 
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Your Information</h2>
        <label>
          Name:
          <input type="text" name="name" value={userInfo.name} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={userInfo.email} onChange={handleChange} required />
        </label>
        <label>
          Phone:
          <input type="tel" name="phone" value={userInfo.phone} onChange={handleChange} required />
        </label>
        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="submit" onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;