import React, { useEffect, useState, useMemo } from "react";

function MyComponent() {
    useEffect(() => {
      // Add Bootstrap styles on component mount
      addBootstrap();
  
      // Clean up by removing Bootstrap styles on component unmount
      return () => {
        removeBootstrap();
      };
    }, []);
  
    return (
      <div>
        <h1 className="text-primary">Hello, world!</h1>
      </div>
    );
  }
  
  function addBootstrap() {
    const link = document.createElement('link');
    link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    link.id = 'bootstrap-css';
    document.head.appendChild(link);
  }
  
  function removeBootstrap() {
    const link = document.getElementById('bootstrap-css');
    if (link) {
      link.parentNode.removeChild(link);
    }
  }
  
  export default MyComponent;
  