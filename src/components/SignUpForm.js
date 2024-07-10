import React, { useState } from "react";
import "./SignUpForm.css"; // Ensure this path is correct

function SignUpForm({ onLogin, setShowLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        password_confirmation: passwordConfirmation,
      }),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        r.json().then((user) => {
          onLogin(user);
          window.location.href = "/"; 
        });
      } else {
        r.json().then((err) => setErrors(err.errors ? err.errors : ["Signup failed"]));
      }
    }).catch(() => {
      setIsLoading(false);
      setErrors(["Network error"]);
    });
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="passwordConfirmation">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirmation"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </div>
        {Array.isArray(errors) && errors.length > 0 && (
          <div className="error-message">
            {errors.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}
        <div className="form-link">
          <p>
            Already have an account? &nbsp;
            <button onClick={() => setShowLogin(true)}>
              Log In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
