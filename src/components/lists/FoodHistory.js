import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import "./FoodHistory.css";

const FoodHistory = ({ foods, setFoods, selectedDate }) => {
  const [filteredFoods, setFilteredFoods] = useState([]);

  useEffect(() => {
    setFilteredFoods(foods.filter(food => food.date === selectedDate));
  }, [foods, selectedDate]);

  const handleDelete = (id) => {
    fetch(`/foods/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setFoods(prevFoods => prevFoods.filter(food => food.id !== id));
        } else {
          console.error("Failed to delete food");
        }
      })
      .catch((error) => {
        console.error("Error deleting food:", error);
      });
  };

  return (
    <div className="food-list">
      <h2>Food History</h2>
      {filteredFoods.length === 0 ? (
        <p>No foods found</p>
      ) : (
        <ul>
          {filteredFoods.map((food) => (
            <li key={food.id} className="food-item">
              <div className="food-header">
                <strong>{food.date}</strong>
                <button onClick={() => handleDelete(food.id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} className="trash-icon" />
                </button>
              </div>
              <div>
                <strong>{food.food_name}</strong>: {food.calories} calories
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodHistory;
