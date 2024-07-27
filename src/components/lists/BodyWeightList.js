import React from 'react';
import './BodyWeightList.css';

const BodyWeightList = ({ bodyWeights }) => {
  return (
    <div className="body-weight-list">
      <h2>Body Weight Progression</h2>
      <ul>
        {bodyWeights.map((bw) => (
          <li key={bw.id}>
            {bw.date}: {bw.weight} lbs
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BodyWeightList;
