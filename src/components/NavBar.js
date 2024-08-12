import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext';
import './NavBar.css';
import logo from '../images/Egg Kettlebell.png';

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
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
        <li className="home-link">
          <NavLink to="/" exact="true" className="home-navlink">
            <img src={logo} alt="Logo" className="nav-logo" />
            YOLKED
          </NavLink>
        </li>
        <li>
          <NavLink to="/workouts" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Workouts
          </NavLink>
        </li>
        <li>
          <NavLink to="/body-weight" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Body Weight
          </NavLink>
        </li>
        <li>
          <NavLink to="/food-logger" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Food Logger
          </NavLink>
        </li>
        {user ? (
          <li className="user-menu" onClick={toggleDropdown}>
            <img src={user.image_url} alt="prof_pic" className="prof-pic" />
            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            <span className="arrow">▼</span>
            {dropdownOpen && (
              <div className="dropdown">
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>Profile</NavLink>
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <li><NavLink to="/login" className={({ isActive }) => (isActive ? 'active-link' : '')}>Login</NavLink></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
