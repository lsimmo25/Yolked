// Profile.js

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Profile.css';
import defaultPicture from '../../images/DefaultProfilePic.png';

const Profile = ({ user, updateUser }) => {
  const [editing, setEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: user.username,
      image_url: "",
      bio: user.bio,
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      image_url: Yup.string().url('Invalid URL'),
      bio: Yup.string(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      const updatedValues = {
        ...values,
        image_url: values.image_url || defaultPicture,
      };
      fetch(`/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedValues),
      })
        .then((r) => r.json())
        .then((updatedUser) => {
          updateUser(updatedUser);
          setEditing(false);
          setSubmitting(false);
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          setSubmitting(false);
        });
    },
  });

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      fetch(`/users/${user.id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            updateUser(null);
            window.location.href = '/signup';
          } else {
            console.error('Failed to delete account');
          }
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
        });
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <img src={user.image_url || defaultPicture} alt="profile_pic" className="profile-pic" />
      <div className="profile-info">
        <h2>{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</h2>
        <p>{user.bio}</p>
        <button onClick={() => setEditing(!editing)} className="edit-button">
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
        {editing && (
          <form onSubmit={formik.handleSubmit} className="edit-form">
            <div className="form-group">
              <label htmlFor="username">New username:</label>
              <input
                type="text"
                id="username"
                {...formik.getFieldProps('username')}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="error-message">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="form-group">
              <label htmlFor="image_url">Profile Picture URL:</label>
              <input
                type="text"
                id="image_url"
                placeholder='Enter Image URL Here'
                {...formik.getFieldProps('image_url')}
              />
              {formik.touched.image_url && formik.errors.image_url ? (
                <div className="error-message">{formik.errors.image_url}</div>
              ) : null}
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                {...formik.getFieldProps('bio')}
              />
              {formik.touched.bio && formik.errors.bio ? (
                <div className="error-message">{formik.errors.bio}</div>
              ) : null}
            </div>
            <button type="submit" className="save-button" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </form>
        )}
        {editing && (
          <button onClick={handleDeleteAccount} className="delete-button">
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
