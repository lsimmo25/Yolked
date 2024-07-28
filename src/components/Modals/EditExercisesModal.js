import React, { useState } from 'react';
import './EditExercisesModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';

const EditExercisesModal = ({ isOpen, onClose, exercises, setExercises }) => {
  const [newExercise, setNewExercise] = useState('');

  if (!isOpen) return null;

  const handleDeleteExercise = (exerciseName) => {
    setExercises((prevExercises) => prevExercises.filter((ex) => ex !== exerciseName));
  };

  const handleAddExercise = () => {
    if (newExercise.trim() === '') return;

    fetch("/exercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newExercise }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error(data.errors);
        } else {
          setExercises((prevExercises) => [...prevExercises, newExercise]);
          setNewExercise('');
        }
      })
      .catch((error) => {
        console.error("Error adding exercise:", error);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Exercises</h2>
        <ul className="exercise-list">
          {exercises.map((exercise) => (
            <li key={exercise} className="exercise-item">
              <span className="exercise-name">{exercise}</span>
              <button onClick={() => handleDeleteExercise(exercise)} className="delete-exercise-button">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          ))}
        </ul>
        <div className="add-exercise-form">
          <h2>Add Exercise</h2>
          <div className="input-button-group">
            <input
              type="text"
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              placeholder="Add New Exercise"
            />
            <button onClick={handleAddExercise} className="add-exercise-button">
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        </div>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default EditExercisesModal;
