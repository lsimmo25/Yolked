import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, updateUser }) => {
  const [editing, setEditing] = useState(false);
  const [image_url, setImageUrl] = useState(user.image_url);
  const [bio, setBio] = useState(user.bio);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url, bio }),
    })
      .then((r) => r.json())
      .then((updatedUser) => {
        updateUser(updatedUser);
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <img src={user.image_url} alt="profile_pic" className="profile-pic" />
      <div className="profile-info">
        <h2>{user.username}</h2>
        <p>{user.bio}</p>
        <button onClick={() => setEditing(!editing)} className="edit-button">
          {editing ? "Cancel" : "Edit Profile"}
        </button>
        {editing && (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label htmlFor="image_url">Profile Picture URL:</label>
              <input
                type="text"
                id="image_url"
                value={image_url}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <button type="submit" className="save-button">Save</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
