import React, { useState } from 'react';
import '../styles/page/DateModal.css';

const DateModal = ({ isOpen, onClose, onSave }) => {
  const [localStartDate, setLocalStartDate] = useState('');
  const [localEndDate, setLocalEndDate] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Dates</h2>
        <input
          type="date"
          value={localStartDate}
          onChange={(e) => setLocalStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={localEndDate}
          onChange={(e) => setLocalEndDate(e.target.value)}
          placeholder="End Date"
        />
        <button onClick={() => { onSave(localStartDate, localEndDate); onClose(); }}>OK</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DateModal;
