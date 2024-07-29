import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import FoodForm from '../forms/FoodForm';
import FoodHistory from '../lists/FoodHistory';
import './FoodLogger.css';

const FoodLogger = () => {
  const { user } = useContext(UserContext);
  const [caloricGoal, setCaloricGoal] = useState(0);
  const [foods, setFoods] = useState([]);
  const [remainingCalories, setRemainingCalories] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));

  useEffect(() => {
    fetch('/caloric_goal')
      .then((r) => r.json())
      .then((data) => setCaloricGoal(data.caloric_goal))
      .catch((error) => console.error('Error fetching caloric goal:', error));
  }, []);

  useEffect(() => {
    fetch('/foods')
      .then((r) => r.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error('Error fetching foods:', error));
  }, []);

  useEffect(() => {
    const totalCaloriesForSelectedDate = foods
      .filter(food => food.date === selectedDate)
      .reduce((sum, food) => sum + food.calories, 0);
    setRemainingCalories(caloricGoal - totalCaloriesForSelectedDate);
  }, [caloricGoal, foods, selectedDate]);

  const addFood = (food) => {
    setFoods([...foods, food]);
  };

  const handleCaloricGoalChange = (e) => {
    const newCaloricGoal = parseInt(e.target.value);
    setCaloricGoal(newCaloricGoal);
    fetch('/caloric_goal', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ caloric_goal: newCaloricGoal }),
    }).catch((error) => console.error('Error updating caloric goal:', error));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="food-logger">
      <h2>Food Logger</h2>
      <div className="caloric-goal">
        <label>
          Daily Caloric Goal:
          <input
            type="number"
            value={caloricGoal}
            onChange={handleCaloricGoalChange}
            placeholder="Enter Caloric Goal"
            className="goal-input"
          />
        </label>
        <label>
          Select Date:
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
        </label>
        <p>Remaining Calories: {remainingCalories}</p>
      </div>
      <div className="food-logger-content">
        <FoodForm addFood={addFood} />
        <FoodHistory foods={foods} setFoods={setFoods} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default FoodLogger;
