#!/usr/bin/env python3

from flask import request, Flask, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api

# Model imports
from models import User, Workout, Exercise, WorkoutExercise


# Routes

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/users', methods=['GET', 'POST'])
def handle_users():
    users = [user.to_dict() for user in User.query.all()]

    if request.method == 'GET':
        try:
            return make_response(jsonify(users), 200)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}))
    
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        image_url = data['image_url']
        bio = data['bio']
        password = data['password']

        if User.query.filter_by(username=data['username']).first():
            return make_response(jsonify({'errors': "Username already exists."}), 400)
        
        try:
            new_user = User(
                username = username,
                image_url = image_url, #optional 
                bio = bio #optional
            )

            new_user.password_hash = password
            db.session.add(new_user)
            db.session.commit()

            return make_response(jsonify(new_user.to_dict()), 201)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)
        
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
    user = User.query.filter_by(user_id=user_id).first()
    
    if request.method == 'GET':
        workouts = [workout.to_dict() for workout in user.workouts]
        return make_response(jsonify(workouts), 200)
    
    if request.method == 'POST':
        data = request.get_json()

        if not 'date' in data:
            return make_response(jsonify({"errors": ["Date is required."]}), 400)

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

if __name__ == '__main__':
    app.run(port=5555, debug=True)