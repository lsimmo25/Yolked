import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import Profile from './pages/Profile';
import Login from './pages/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/profile" element={<Profile user={user} updateUser={setUser}/>} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
