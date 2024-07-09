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

        if User.query.filter_by(username=data['username']).first()
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



if __name__ == '__main__':
    app.run(port=5555, debug=True)