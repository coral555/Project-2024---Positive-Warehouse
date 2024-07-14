// src/manager/components/navbar/NavbarManger.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { useCombined } from "../../../context/CombinedContext";

export const NavbarManger = () => {
  const { fetchMoreProducts } = useCombined();
  const [isOpen, setIsOpen] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const handleMouseEnter = () => {
    if (timerId) {
      clearTimeout(timerId); 
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 300); 

    setTimerId(id);
  };

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  return (
    <div
      className={`vertical-nav-bar ${isOpen ? "open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to="/EditInventory">ערוך מלאי</Link>
      <Link to="/AddNewProduct">הוספת מוצר חדש</Link>
      <Link to="/ManageCategories">עריכת קטגוריות</Link> 
      <Link to="/ManageOrders">ניהול הזמנות</Link>
      <Link to="/Reports">דוחות</Link>
    </div>
  );
};

export default NavbarManger;