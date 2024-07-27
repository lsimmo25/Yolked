import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faFire } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

const Home = () => {
  const { user } = useContext(UserContext);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [hotStreak, setHotStreak] = useState(0);
  const [totalWeightEntries, setTotalWeightEntries] = useState(0);
  const [weightsHotStreak, setWeightsHotStreak] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('Unknown');
  const [personalRecords, setPersonalRecords] = useState({});
  const [newPRsToday, setNewPRsToday] = useState({});

  useEffect(() => {
    fetch('/workouts')
      .then((response) => response.json())
      .then((data) => {
        const workoutDates = data.map(workout => new Date(workout.date));
        setTotalWorkouts(workoutDates.length);

        workoutDates.sort((a, b) => b - a);

        let workoutStreak = 0;
        let previousDate = new Date();

        for (let date of workoutDates) {
          const diff = Math.floor((previousDate - date) / (1000 * 60 * 60 * 24));

          if (diff === 1 || (diff === 0 && workoutStreak === 0)) {
            workoutStreak++;
          } else {
            break;
          }

          previousDate = date;
        }

        setHotStreak(workoutStreak);

        const pr = calculatePersonalRecords(data);
        setPersonalRecords(pr);

        // Determine new PRs for today
        const today = new Date().setHours(0, 0, 0, 0);
        const newPRsToday = {};
        data.forEach(workout => {
          const workoutDate = new Date(workout.date).setHours(0, 0, 0, 0);
          if (workoutDate === today) {
            workout.exercises.forEach(exercise => {
              const maxWeight = exercise.sets.reduce((max, set) => Math.max(max, set.weight), 0);
              if (pr[exercise.name] === maxWeight) {
                newPRsToday[exercise.name] = true;
              }
            });
          }
        });

        setNewPRsToday(newPRsToday);
      })
      .catch((error) => console.error('Error fetching workouts:', error));
  }, []);

  useEffect(() => {
    fetch('/body_weights')
      .then((response) => response.json())
      .then((data) => {
        const weightDates = data.map(entry => new Date(entry.date));
        setTotalWeightEntries(weightDates.length);

        weightDates.sort((a, b) => b - a);

        let weightStreak = 0;
        let previousDate = new Date();

        for (let date of weightDates) {
          const diff = Math.floor((previousDate - date) / (1000 * 60 * 60 * 24));

          if (diff === 1 || (diff === 0 && weightStreak === 0)) {
            weightStreak++;
          } else {
            break;
          }

          previousDate = date;
        }

        setWeightsHotStreak(weightStreak);

        if (data.length > 0) {
          setCurrentWeight(data[0].weight);
        }
      })
      .catch((error) => console.error('Error fetching body weight entries:', error));
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
            <h2>Hot Streak <FontAwesomeIcon icon={faFire} className="hotstreak-icon" /></h2>
            <p>{hotStreak} days</p>
          </div>
          <div className="stat">
            <h2>Total Weight Entries</h2>
            <p>{totalWeightEntries}</p>
          </div>
          <div className="stat">
            <h2>Hot Streak <FontAwesomeIcon icon={faFire} className="hotstreak-icon" /></h2>
            <p>{weightsHotStreak} days</p>
          </div>
          {currentWeight !== null && (
            <div className="stat full-width">
              <h2>Current Weight</h2>
              <p>{currentWeight} lbs</p>
            </div>
          )}
        </div>
        <div className="pr-container">
          <h2>Personal Records (PR)</h2>
          <ul>
            {Object.entries(personalRecords).map(([exercise, weight]) => (
              <li key={exercise}>
                {exercise.charAt(0).toUpperCase() + exercise.slice(1)}: {weight} lbs
                {newPRsToday[exercise] && <FontAwesomeIcon icon={faTrophy} className="pr-icon" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
