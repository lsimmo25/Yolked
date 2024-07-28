import React from 'react';
import './EditExercisesModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const EditExercisesModal = ({ isOpen, onClose, exercises, setExercises }) => {
  if (!isOpen) return null;

  const handleDeleteExercise = (exerciseName) => {
    if (window.confirm(`Are you sure you want to delete the exercise: ${exerciseName}?`)) {
      fetch(`/exercises`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: exerciseName }),
      })
        .then((response) => {
          if (response.ok) {
            setExercises((prevExercises) => prevExercises.filter((ex) => ex !== exerciseName));
          } else {
            console.error('Failed to delete exercise');
          }
        })
        .catch((error) => {
          console.error('Error deleting exercise:', error);
        });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Exercises</h2>
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise} className="exercise-item">
              {exercise}
              <button onClick={() => handleDeleteExercise(exercise)} className="delete-exercise-button">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default EditExercisesModal;
