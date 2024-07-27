import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(UserContext);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [hotStreak, setHotStreak] = useState(0);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('Unknown');
  const [personalRecords, setPersonalRecords] = useState({});

  useEffect(() => {
    fetch('/workouts')
      .then((response) => response.json())
      .then((data) => {
        const workoutDates = data.map(workout => new Date(workout.date));
        setTotalWorkouts(workoutDates.length);

        workoutDates.sort((a, b) => b - a);

        let streak = 0;
        let previousDate = new Date();

        for (let date of workoutDates) {
          const diff = Math.floor((previousDate - date) / (1000 * 60 * 60 * 24));

          if (diff === 1 || (diff === 0 && streak === 0)) {
            streak++;
          } else {
            break;
          }

          previousDate = date;
        }

        setHotStreak(streak);

        const pr = calculatePersonalRecords(data);
        setPersonalRecords(pr);
      })
      .catch((error) => console.error('Error fetching workouts:', error));
  }, []);

  useEffect(() => {
    fetch('https://type.fit/api/quotes')
      .then((response) => response.json())
      .then((data) => {
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        setQuote(randomQuote.text);
        setAuthor(randomQuote.author ? randomQuote.author : 'Unknown');
      })
      .catch((error) => console.error('Error fetching quote:', error));
  }, []);

  const calculatePersonalRecords = (workouts) => {
    const pr = {};

    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const maxWeight = exercise.sets.reduce((max, set) => Math.max(max, set.weight), 0);
        if (!pr[exercise.name] || pr[exercise.name] < maxWeight) {
          pr[exercise.name] = maxWeight;
        }
      });
    });

    return pr;
  };

  const welcomeMessage = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return `Happy ${days[today]}!`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h1 className="welcome-message">Hi, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!</h1>
        <h3 className="day-message">{welcomeMessage()}</h3>
        <p className="quote">"{quote}"</p>
        <p className="author">- {author}</p>
        <div className="stats-container">
          <div className="stat">
            <h2>Total Workouts</h2>
            <p>{totalWorkouts}</p>
          </div>
          <div className="stat">
            <h2>Hot Streak 🔥</h2>
            <p>{hotStreak} days</p>
          </div>
        </div>
        <div className="pr-container">
          <h2>Personal Records (PR)</h2>
          <ul>
            {Object.entries(personalRecords).map(([exercise, weight]) => (
              <li key={exercise}>
                {exercise.charAt(0).toUpperCase() + exercise.slice(1)}: {weight} lbs
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;