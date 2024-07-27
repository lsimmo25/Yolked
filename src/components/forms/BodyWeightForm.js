import React, { useState, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import './BodyWeightForm.css';

const BodyWeightForm = ({ addBodyWeight }) => {
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const { user } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/body_weights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, weight: parseFloat(weight) }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error('Network response was not ok ' + r.statusText);
        }
        return r.json();
      })
      .then((data) => {
        console.log('Body weight logged:', data);
        addBodyWeight(data);
        setDate('');
        setWeight('');
      })
      .catch((error) => console.error('Error logging body weight:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="body-weight-form">
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label>
        Weight:
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder='Enter Weight'
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default BodyWeightForm;
