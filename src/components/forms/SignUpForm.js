import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./SignUpForm.css";
import logo from '../../images/Egg_Signup.png';

function SignUpForm({ onLogin, setShowLogin }) {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords must match")
        .required("Password confirmation is required"),
    }),
    onSubmit: (values, { setSubmitting, setErrors }) => {
      setSubmitting(true);
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          password_confirmation: values.passwordConfirmation,
        }),
      })
        .then((r) => {
          if (r.ok) {
            r.json().then((user) => {
              fetch("/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: values.username,
                  password: values.password,
                }),
              })
                .then((r) => {
                  setSubmitting(false);
                  if (r.ok) {
                    r.json().then((user) => {
                      onLogin(user);
                      window.location.href = "/";
                    });
                  } else {
                    setErrors({ server: ["Login failed"] });
                  }
                })
                .catch(() => {
                  setSubmitting(false);
                  setErrors({ server: ["Network error"] });
                });
            });
          } else {
            r.json().then((err) =>
              setErrors({ server: err.errors ? err.errors : ["Signup failed"] })
            );
            setSubmitting(false);
          }
        })
        .catch(() => {
          setSubmitting(false);
          setErrors({ server: ["Network error"] });
        });
    },
  });

  return (
    <div className="signup-container">
      <h1>Yolked</h1>
      <img src={logo} alt="Logo" className="signup-logo" />
      <form onSubmit={formik.handleSubmit} className="signup-form">
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
            autoComplete="new-password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error-message">{formik.errors.password}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="passwordConfirmation">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirmation"
            autoComplete="new-password"
            {...formik.getFieldProps("passwordConfirmation")}
          />
          {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ? (
            <div className="error-message">{formik.errors.passwordConfirmation}</div>
          ) : null}
        </div>
        <div>
          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Loading..." : "Sign Up"}
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
        <div className="signup-login-link">
          <p>
            Already have an account? &nbsp;
            <button type="button" onClick={() => setShowLogin(true)}>
              Log In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
