import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider, UserContext } from './Context/UserContext';
import NavBar from './NavBar';
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import Profile from './pages/Profile';
import Login from './pages/Login';
import BodyWeight from './pages/BodyWeight';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <MainApp />
      </Router>
    </UserProvider>
  );
}

function MainApp() {
  const { user, setUser } = React.useContext(UserContext);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <>
      <NavBar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/body-weight" element={<BodyWeight />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
