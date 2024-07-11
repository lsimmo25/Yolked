import React, { useEffect, useState } from "react";
import "./WorkoutHistory.css";

const WorkoutHistory = ({ workouts, setWorkouts }) => {
  const fetchWorkouts = () => {
    fetch("/workouts")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setWorkouts(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching workouts:", error);
      });
  };

  useEffect(() => {
    fetchWorkouts();
  }, [setWorkouts]);

  const handleDelete = (id) => {
    fetch(`/workouts/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Optimistically update state
          setWorkouts((prevWorkouts) => prevWorkouts.filter(workout => workout.id !== id));
        } else {
          console.error("Failed to delete workout");
        }
      })
      .catch((error) => {
        console.error("Error deleting workout:", error);
      });
  };

  return (
    <div className="workout-list">
      <h2>Workout History</h2>
      {workouts.length === 0 ? (
        <p>No workouts found</p>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id} className="workout-item">
              <div className="workout-header">
                <strong>{workout.date}</strong>
                <button onClick={() => handleDelete(workout.id)} className="delete-button">x</button>
              </div>
              <ul>
                {workout.exercises && workout.exercises.length > 0 ? (
                  workout.exercises.map((exercise, exerciseIndex) => (
                    <li key={exerciseIndex} className="exercise-item">
                      <strong>{exercise.name}</strong>
                      <ul>
                        {exercise.sets && exercise.sets.length > 0 ? (
                          exercise.sets.map((set, setIndex) => (
                            <li key={setIndex} className="set-item">
                              Weight: {set.weight}, Reps: {set.reps}
                            </li>
                          ))
                        ) : (
                          <li>No sets found</li>
                        )}
                      </ul>
                    </li>
                  ))
                ) : (
                  <li>No exercises found</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutHistory;
