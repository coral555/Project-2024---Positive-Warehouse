import React, { useState } from 'react';

const UserDetailsModal = ({ isOpen, onClose, onSave }) => {
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(details);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h2>User Details</h2>
        <label>
          Name:
          <input type="text" name="name" value={details.name} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={details.email} onChange={handleChange} />
        </label>
        <label>
          Phone:
          <input type="tel" name="phone" value={details.phone} onChange={handleChange} />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={details.address} onChange={handleChange} />
        </label>
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default UserDetailsModal;
