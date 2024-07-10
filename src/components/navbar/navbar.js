import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoCartOutline, IoCallOutline, IoCardOutline, IoLogInOutline, IoHomeOutline } from "react-icons/io5";
import "./navbar.css";
import { useSelector } from "react-redux";

export const Navbar = () => {
  const cartItems = useSelector((state) => state.cart);
  const orderPlaced = useSelector((state) => state.orderPlaced);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  return (
    <div className="navbar">
      <div className="left-links">
        <NavLink to="/loginPage" className={isActive("/loginPage")}>
          <IoLogInOutline size={30} style={isActive("/loginPage") ? { color: "#33e900" } : {}} />
        </NavLink>
      </div>
      <div className="middle-left">
        <NavLink to="/cart" className={`cart-link ${isActive("/cart")}`}>
          <IoCartOutline size={30} style={isActive("/cart") ? { color: "#33e900" } : {}} />
          {Object.keys(cartItems).length > 0 && orderPlaced && (
            <span className="cart-notification" />
          )}
        </NavLink> 
      </div>
      <div className="links">
        <NavLink to="/AboutWarehouse" className={isActive("/AboutWarehouse")}>
          מי אנחנו
        </NavLink>
        <NavLink to="/ViewInventory" className={isActive("/ViewInventory")}>
          הצגה
        </NavLink>
        <NavLink exact="true" to="/" className={isActive("/")}>
          <IoHomeOutline size={32} />
        </NavLink>
      </div>
      <NavLink to="/contact" className={`support-icon ${isActive("/contact")}`}>
        <IoCallOutline size={38} style={isActive("/contact") ? { color: "#33e900" } : {}} />
      </NavLink>
      <a
        href="https://payboxapp.page.link/ByZyKCSDAWy7Y4eL9"
        target="_blank"
        rel="noopener noreferrer"
        className={`pay-icon ${isActive("https://payboxapp.page.link/ByZyKCSDAWy7Y4eL9")}`}
      >
        <IoCardOutline size={38} />
      </a>
    </div>
  );
};

export default Navbar;
