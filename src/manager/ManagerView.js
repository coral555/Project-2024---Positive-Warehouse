import React from 'react';
import { Link } from 'react-router-dom';
// import './ManagerView.css';

const ManagerView = () => {
  return (
    <div className="manager-container">
      <Link to="/">
        <button>Back to Home</button>
      </Link>
      <h2>Manager Dashboard</h2>
      <div className="manager-buttons">
        <Link to="/edit-inventory">
          <button>Edit Inventory</button>
        </Link>
        <Link to="/">
          <button>reports</button>
        </Link>
        <Link to="/">
          <button>...</button>
        </Link>
        {/* Add more buttons for other manager tasks if needed */}
      </div>
    </div>
  );
};

export default ManagerView;
