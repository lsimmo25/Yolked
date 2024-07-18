// Navbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import logo from '../images/Egg Kettlebell.png';

const NavBar = ({ user, setUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.ok) {
          setUser(null);
          navigate('/login');
        }
      });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">
          <img src={logo} alt="Logo" className="nav-logo" />
          Home
        </Link></li>
        <li><Link to="/workouts">Workouts</Link></li>
        {user ? (
          <li className="user-menu" onClick={toggleDropdown}>
            <img src={user.image_url} alt="prof_pic" className="prof-pic" />
            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            <span className="arrow">▼</span>
            {dropdownOpen && (
              <div className="dropdown">
                <Link to="/profile">Profile</Link>
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
