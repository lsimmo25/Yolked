import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ user, setUser }) => {
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

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/workouts">Workouts</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        {user ? (
          <>
            <li><button onClick={handleLogout}>Logout</button></li>
            <li>{user.username}</li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
