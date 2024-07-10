import React, { useEffect } from "react";

const WorkoutList = ({ workouts, setWorkouts }) => {
  useEffect(() => {
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
  }, [setWorkouts]);

  return (
    <div>
      <h2>Workout List</h2>
      {workouts.length === 0 ? (
        <p>No workouts found</p>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              {workout.date}
              <ul>
                {workout.exercises && workout.exercises.map((exercise) => (
                  <li key={exercise.id}>
                    {exercise.name}
                    <ul>
                      {exercise.sets && exercise.sets.map((set, index) => (
                        <li key={`${exercise.id}-${index}`}>
                          Weight: {set.weight}, Reps: {set.reps}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutList;
