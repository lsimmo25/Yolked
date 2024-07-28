import React, { useEffect, useState, useContext } from "react";
import WorkoutForm from "../forms/WorkoutForm";
import WorkoutHistory from '../lists/WorkoutHistory';
import { UserContext } from '../Context/UserContext';
import '../lists/WorkoutHistory.css';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const { user } = useContext(UserContext);

  const fetchWorkouts = () => {
    fetch(`/workouts?user_id=${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setWorkouts(data);
        extractUniqueExercises(data);
      })
      .catch((error) => console.error("Error fetching workouts:", error));
  };

  const extractUniqueExercises = (workouts) => {
    const uniqueExercises = new Set();
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        uniqueExercises.add(exercise.name);
      });
    });
    setExercises(Array.from(uniqueExercises));
  };

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const handleAddWorkout = () => {
    fetchWorkouts();
  };

  return (
    <div>
      <h1 style={{ marginLeft: '20px', color: '#fff' }}>Workouts</h1>
      <div className="workout-container">
        <WorkoutForm updateWorkouts={handleAddWorkout} exercises={exercises} setExercises={setExercises} />
        <WorkoutHistory workouts={workouts} setWorkouts={setWorkouts} />
      </div>
    </div>
  );
};

export default Workouts;
