import React, { useEffect, useState } from "react";
import WorkoutForm from "../forms/WorkoutForm";
import WorkoutList from '../lists/WorkoutList';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetch("/workout_exercises")
      .then((response) => response.json())
      .then((data) => setWorkouts(data))
      .catch((error) => console.error("Error fetching workouts:", error));
  }, []);

  const handleAddWorkout = (newWorkout) => {
    setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
  };

  return (
    <div>
      <h1>Workouts</h1>
      <WorkoutForm onSubmit={handleAddWorkout} updateWorkouts={handleAddWorkout}/>
      <WorkoutList workouts={workouts} setWorkouts={setWorkouts} />
    </div>
  );
};

export default Workouts;
