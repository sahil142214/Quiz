// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';  // Optional: Add your CSS file for styling

const Navbar = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");  // Navigate to profile page
  };

  return (
    <nav className="navbar">
      <h2>Quiz App</h2>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <button onClick={handleProfileClick} className="profile-button">Profile</button>
      </div>
    </nav>
  );
};

export default Navbar;
