import React, { useState } from "react";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]); // Initialize errors as an array
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]); // Reset errors on form submission

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        r.json().then((user) => {
          onLogin(user);
          window.location.href = "/"; // Redirect to the homepage
        });
      } else {
        r.json().then((err) => setErrors(err.errors ? err.errors : ["Login failed"]));
      }
    }).catch(() => {
      setIsLoading(false);
      setErrors(["Network error"]);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Login</h2>
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">{isLoading ? "Loading..." : "Login"}</button>
      </div>
      {Array.isArray(errors) && errors.length > 0 && (
        <div>
          {errors.map((err, index) => (
            <p key={index} style={{ color: "red" }}>
              {err}
            </p>
          ))}
        </div>
      )}
    </form>
  );
}

export default LoginForm;
