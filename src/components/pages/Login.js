import React, { useState, useContext } from "react";
import { UserContext } from '../Context/UserContext';
import LoginForm from '../forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';

function Login() {
  const [showLogin, setShowLogin] = useState(true);
  const { setUser } = useContext(UserContext);

  return (
    <div className="login-signup-container">
      {showLogin ? (
        <LoginForm onLogin={setUser} setShowLogin={setShowLogin} />
      ) : (
        <SignUpForm onLogin={setUser} setShowLogin={setShowLogin} />
      )}
    </div>
  );
}

export default Login;
