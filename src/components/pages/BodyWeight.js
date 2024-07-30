import React, { useState, useEffect, useContext } from 'react';
import BodyWeightForm from '../forms/BodyWeightForm';
import BodyWeightList from '../lists/BodyWeightList';
import LineGraph from '../Graphs/LineGraph';
import { UserContext } from '../Context/UserContext';
import './BodyWeight.css';
import moment from 'moment-timezone';

const BodyWeight = () => {
  const [bodyWeights, setBodyWeights] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch('/body_weights')
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item) => {
            const easternTimeDate = moment.tz(item.date, 'America/New_York').format('YYYY-MM-DD');
            console.log(`Fetched date (UTC): ${item.date}, converted to Eastern Time: ${easternTimeDate}`);
            return {
              ...item,
              date: easternTimeDate
            };
          });
          setBodyWeights(sortedData);
        }
      })
      .catch((error) => console.error('Error fetching body weights:', error));
  }, []);

  const addBodyWeight = (newBodyWeight) => {
    const easternTimeDate = moment.tz(newBodyWeight.date, 'America/New_York').format('YYYY-MM-DD');
    console.log(`New body weight date: ${newBodyWeight.date}, converted to Eastern Time: ${easternTimeDate}`);
    const updatedBodyWeights = [...bodyWeights, {
      ...newBodyWeight,
      date: easternTimeDate
    }].sort((a, b) => new Date(b.date) - new Date(a.date));
    setBodyWeights(updatedBodyWeights);
  };

  const deleteBodyWeight = (id) => {
    fetch(`/body_weights/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setBodyWeights(bodyWeights.filter((weight) => weight.id !== id));
      })
      .catch((error) => console.error('Error deleting body weight:', error));
  };

  return (
    <div className="body-weight-container">
      <h1>Progress</h1>
      <LineGraph data={bodyWeights} />
      <h1>Log</h1>
      <BodyWeightForm addBodyWeight={addBodyWeight} />
      <BodyWeightList bodyWeights={bodyWeights} deleteBodyWeight={deleteBodyWeight} />
    </div>
  );
};

export default BodyWeight;
