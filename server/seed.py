#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Workout, Exercise, WorkoutExercise

def create_users(fake, num_users=10):
    users = []
    for _ in range(num_users):
        username = fake.user_name()
        password = 'password'  # Default password for all users
        image_url = fake.image_url()
        bio = fake.text(max_nb_chars=200)
        
        user = User(
            username=username,
            image_url=image_url,
            bio=bio
        )
        user.password_hash = password  # Set the password hash
        users.append(user)
        db.session.add(user)
    
    db.session.commit()
    return users

def create_exercises(fake, num_exercises=10):
    exercises = []
    for _ in range(num_exercises):
        name = fake.word()
        exercise = Exercise(name=name)
        exercises.append(exercise)
        db.session.add(exercise)
    
    db.session.commit()
    return exercises

def create_workouts(fake, users, num_workouts=50):
    workouts = []
    for _ in range(num_workouts):
        date = fake.date_this_year()
        user = rc(users)
        
        workout = Workout(
            date=date,
            user_id=user.id
        )
        workouts.append(workout)
        db.session.add(workout)
    
    db.session.commit()
    return workouts

def create_workout_exercises(fake, workouts, exercises, num_workout_exercises=100):
    for _ in range(num_workout_exercises):
        workout = rc(workouts)
        exercise = rc(exercises)
        weight = randint(5, 200)  # Random weight between 5 and 200
        reps = randint(1, 20)  # Random reps between 1 and 20

        workout_exercise = WorkoutExercise(
            workout_id=workout.id,
            exercise_id=exercise.id,
            weight=weight,
            reps=reps
        )
        db.session.add(workout_exercise)
    
    db.session.commit()

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create users
        users = create_users(fake, num_users=10)
        
        # Create exercises
        exercises = create_exercises(fake, num_exercises=10)
        
        # Create workouts
        workouts = create_workouts(fake, users, num_workouts=50)
        
        # Create workout exercises
        create_workout_exercises(fake, workouts, exercises, num_workout_exercises=100)
        
        print("Seeding complete!")
