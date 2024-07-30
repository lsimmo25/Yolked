import React from 'react';
import './BodyWeightList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const BodyWeightList = ({ bodyWeights, deleteBodyWeight }) => {
  return (
    <div className="body-weight-list">
      <h2>Body Weight Progression</h2>
      <ul>
        {bodyWeights.map((bw) => (
          <li key={bw.id}>
            {bw.date}: {bw.weight} lbs
            <button className="delete-button" onClick={() => deleteBodyWeight(bw.id)}>
              <FontAwesomeIcon icon={faTrash} className="trash-icon" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BodyWeightList;
