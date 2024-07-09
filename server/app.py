#!/usr/bin/env python3

from flask import request, Flask, make_response, jsonify, session
from flask_restful import Resource
from flask_session import Session

# Local imports
from config import app, db, api

# Model imports
from models import User, Workout, Exercise, WorkoutExercise

# Configure Session
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'supersecretkey'
Session(app)

# Routes

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    image_url = data.get('image_url')
    bio = data.get('bio')
    password = data['password']

    if User.query.filter_by(username=username).first():
        return make_response(jsonify({'errors': "Username already exists."}), 400)
    
    try:
        new_user = User(
            username=username,
            image_url=image_url,  # optional
            bio=bio  # optional
        )

        new_user.password_hash = password
        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify(new_user.to_dict()), 201)
    except Exception as e:
        return make_response(jsonify({"errors": [str(e)]}), 400)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    if user and user.authenticate(password):
        session['user_id'] = user.id
        return make_response(jsonify({'message': 'Login successful'}), 200)
    else:
        return make_response(jsonify({'errors': 'Invalid username or password'}), 400)

@app.route('/checksession', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            return make_response(jsonify(user.to_dict()), 200)
    return make_response(jsonify({'message': 'Not logged in'}), 401)

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return make_response(jsonify({'message': 'Logout successful'}), 200)

@app.route('/users', methods=['GET'])
def handle_users():
    users = [user.to_dict() for user in User.query.all()]

    if request.method == 'GET':
        try:
            return make_response(jsonify(users), 200)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}))
        
@app.route('/users/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def handle_user_by_id(id):
    user = User.query.filter_by(id=id).first()

    if not user:
        return make_response(jsonify({"errors": ["User not found"]}), 400)

    if request.method == 'GET':
        try:
            return make_response(jsonify(user.to_dict()), 200)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)

    if request.method == 'PATCH':

        data = request.get_json()

        try:
            if 'username' in data:
                user.username = data['username']
            
            if 'password' in data:
                user.password_hash = data['password']
            
            if 'image_url' in data:
                user.image_url = data['image_url']
            
            if 'bio' in data:
                user.bio = data['bio']
            
            db.session.commit()
            return make_response(jsonify(user.to_dict()), 200)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)
        
    if request.method == 'DELETE':
        try:
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({"message": "User deleted successfully"}), 200)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)
        
@app.route('/users/<int:user_id>/workouts', methods=['GET', 'POST'])
def handle_workouts(user_id):
    user = User.query.filter_by(id=user_id).first()
    
    if request.method == 'GET':
        workouts = [workout.to_dict() for workout in user.workouts]
        return make_response(jsonify(workouts), 200)
    
    if request.method == 'POST':
        data = request.get_json()

        try:
            new_workout = Workout(
                date=data['date'],
                user_id=user.id
            )
            db.session.add(new_workout)
            db.session.commit()
            return make_response(jsonify(new_workout.to_dict()), 201)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)

@app.route('/workouts/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def handle_workout_by_id(id):
    workout = Workout.query.filter_by(id=id).first()
    
    if request.method == 'GET':
        return make_response(jsonify(workout.to_dict()), 200)

    if request.method == 'PATCH':
        data = request.get_json()

        if 'date' in data:
            workout.date = data['date']

        try:
            db.session.commit()
            return make_response(jsonify(workout.to_dict()), 200)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)

    if request.method == 'DELETE':
        try:
            db.session.delete(workout)
            db.session.commit()
            return make_response(jsonify({"message": "Workout deleted successfully"}), 200)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)

@app.route('/exercises', methods=['GET', 'POST'])
def handle_exercises():

    if request.method == 'GET':
        exercises = [exercise.to_dict() for exercise in Exercise.query.all()]
        return make_response(jsonify(exercises), 200)
    
    if request.method == 'POST':
        data = request.get_json()

        try:
            new_exercise = Exercise(
                name=data['name']
            )
            db.session.add(new_exercise)
            db.session.commit()
            return make_response(new_exercise.to_dict(), 201)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)
        
@app.route('/exercises/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def handle_exercise_by_id(id):
    exercise = Exercise.query.filter_by(id=id).first()
    
    if not exercise:
        return make_response(jsonify({"errors": ["Exercise not found"]}), 400)

    if request.method == 'GET':
        return make_response(jsonify(exercise.to_dict()), 200)

    if request.method == 'PATCH':
        data = request.get_json()

        if 'name' in data:
            exercise.name = data['name']

        try:
            db.session.commit()
            return make_response(jsonify(exercise.to_dict()), 200)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)

    if request.method == 'DELETE':
        try:
            db.session.delete(exercise)
            db.session.commit()
            return make_response(jsonify({"message": "Exercise deleted successfully"}), 200)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)

if __name__ == '__main__':
    app.run(port=5555, debug=True)