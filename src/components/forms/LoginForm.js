import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./LoginForm.css";
import logo from '../../images/Egg_Squat.png';

function LoginForm({ onLogin, setShowLogin }) {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values, { setSubmitting, setErrors }) => {
      setSubmitting(true);
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => {
          setSubmitting(false);
          if (r.ok) {
            r.json().then((user) => {
              onLogin(user);
              window.location.href = "/";
            });
          } else {
            r.json().then((err) =>
              setErrors({ server: err.errors ? err.errors : ["Login failed"] })
            );
          }
        })
        .catch(() => {
          setSubmitting(false);
          setErrors({ server: ["Network error"] });
        });
    },
  });

  return (
    <div className="login-container">
      <h1>Get Yolked</h1>
       <img src={logo} alt="Logo" className="login-logo" />
      <form onSubmit={formik.handleSubmit} className="login-form">
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            autoComplete="off"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="error-message">{formik.errors.username}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error-message">{formik.errors.password}</div>
          ) : null}
        </div>
        <div>
          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Loading..." : "Login"}
          </button>
        </div>
        {formik.errors.server && (
          <div className="error-message">
            {Array.isArray(formik.errors.server)
              ? formik.errors.server.map((err, index) => (
                  <p key={index}>{err}</p>
                ))
              : formik.errors.server}
          </div>
        )}
        <div className="login-signup-link">
          <p>
            Don't have an account? &nbsp;
            <button type="button" onClick={() => setShowLogin(false)}>
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
