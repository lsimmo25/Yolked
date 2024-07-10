import React, { useState } from "react";
import LoginForm from '../forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';

function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="login-signup-container">
      {showLogin ? (
        <LoginForm onLogin={onLogin} setShowLogin={setShowLogin} />
      ) : (
        <SignUpForm onLogin={onLogin} setShowLogin={setShowLogin} />
      )}
    </div>
  );
}

export default Login;
