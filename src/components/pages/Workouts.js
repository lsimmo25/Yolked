import React, { useEffect, useState } from "react";
import WorkoutForm from "../forms/WorkoutForm";
import WorkoutHistory from '../lists/WorkoutHistory';
import '../lists/WorkoutHistory.css';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = () => {
    fetch("/workouts")
      .then((response) => response.json())
      .then((data) => setWorkouts(data))
      .catch((error) => console.error("Error fetching workouts:", error));
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleAddWorkout = () => {
    fetchWorkouts();
  };

  return (
    <div>
      <h1 style={{ marginLeft: '20px', color: '#fff' }}>Workouts</h1>
      <div className="workout-container">
        <WorkoutForm updateWorkouts={handleAddWorkout} />
        <WorkoutHistory workouts={workouts} setWorkouts={setWorkouts} />
      </div>
    </div>
  );
};

export default Workouts;
