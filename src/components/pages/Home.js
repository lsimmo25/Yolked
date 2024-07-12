import React from 'react';

const Home = ({ user, setUser }) => (
  <div>
    <h1 style={{ marginLeft: '20px', color: '#fff' }}>Hi, {user.username}!</h1>
  </div>
);

export default Home;