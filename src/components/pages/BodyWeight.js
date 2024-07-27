import React, { useState, useEffect, useContext } from 'react';
import BodyWeightForm from '../forms/BodyWeightForm';
import BodyWeightList from '../lists/BodyWeightList';
import LineGraph from '../Graphs/LineGraph';
import { UserContext } from '../Context/UserContext';
import './BodyWeight.css';

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
          const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString()
          }));
          setBodyWeights(sortedData);
        }
      })
      .catch((error) => console.error('Error fetching body weights:', error));
  }, []);

  const addBodyWeight = (newBodyWeight) => {
    const updatedBodyWeights = [...bodyWeights, {
      ...newBodyWeight,
      date: new Date(newBodyWeight.date).toLocaleDateString()
    }].sort((a, b) => new Date(b.date) - new Date(a.date));
    setBodyWeights(updatedBodyWeights);
  };

  return (
    <div className="body-weight-container">
      <h1>Progress</h1>
      <LineGraph data={bodyWeights} />
      <h1>Log</h1>
      <BodyWeightForm addBodyWeight={addBodyWeight} />
      <BodyWeightList bodyWeights={bodyWeights} />
    </div>
  );
};

export default BodyWeight;