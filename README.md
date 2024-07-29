# Yolked - Workout Tracker

## Overview

Yolked is a workout tracking application designed to help users log, track, and manage their workout routines. The app allows users to create workout logs, view workout history, and manage their profile. The user interface is built with React, and the backend is powered by Flask with SQLAlchemy.

## Features

- **User Authentication**: Users can sign up, log in, and log out.
- **Profile Management**: Users can update their profile picture bio and username.
- **Workout Logging**: Users can add new workouts with details about exercises, weights, and reps.
- **Workout History**: Users can view their workout history filtered by date.
- **Delete Workouts**: Users can delete specific workout entries.
- **Responsive Design**: The app is designed to be responsive and works well on various screen sizes.
- **Home Dashboard**: See your total workouts, total bodyweights logged, hot streaks, current weight, and personal bests. Greeted with a motivational quote
- **Body Weight Logging**: Log your body weight and view your progress with a graph
- **Food Logging**: Log Food and Calories remaining

## Installation

### Prerequisites

- Node.js and npm installed
- Python 3.8+ installed
- Flask
- SQLAlchemy

### Frontend Setup

1. Install the required dependencies:

- npm install

2. Start the React Development Server:

- npm start

### Backend Setup

1. Install dependencies:

- pipenv install

2. Enter Virtual Enviornment:

- pipenv shell

3. Navigate To Server Folder:

- cd server

4. Setup Database:

- flask db init
- flask db migrate -m "initial migration"
- flask db upgrade

5. Optional Setup

- FLASK_APP=app.py
- FLASK_RUN_PORT=5555

6. Start Flask Development Server

- flask run or python app.py

### Usage

1. Open your browser and navigate to http://localhost:3000 to access the application.
2. Sign up for a new account or log in with existing credentials.
3. Add, view, and manage your workouts.
4. Update your profile with a new picture and bio if desired.
5. Filter workout history by date to view specific entries.

### Contributing

If you would like to contribute to this project, please fork the repository and create a new branch for your feature or bug fix. Once you have completed your changes, open a pull request and describe the changes you have made.

### License

This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgements

- React
- Formik
- Yup
- Flask
- SQLAlchemy
- Type Fit API
- FontAwesome

