from flask import Flask, request, jsonify, session
from flask_restful import Resource, Api
from flask_session import Session
from config import db, app
from models import User, WeightEntry
from datetime import datetime
import pytz

# Configure Session
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'supersecretkey'
Session(app)
api = Api(app)

def get_current_user_id():
    return session.get('user_id')

class HomePage(Resource):
    def get(self):
        return '<h1>Project Server</h1>'

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        image_url = data.get('image_url')
        bio = data.get('bio')
        password = data['password']

        if User.query.filter_by(username=username).first():
            return {'errors': "Username already exists."}, 400
        
        try:
            new_user = User(
                username=username,
                image_url=image_url,
                bio=bio
            )
            new_user.password_hash = password
            db.session.add(new_user)
            db.session.commit()

            return new_user.to_dict(), 201
        except Exception as e:
            return {"errors": [str(e)]}, 400

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id
            return {'message': 'Login successful'}, 200
        else:
            return {'errors': 'Invalid username or password'}, 400

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                return user.to_dict(), 200
        return {'message': 'Not logged in'}, 401

class Logout(Resource):
    def post(self):
        session.pop('user_id', None)
        return {'message': 'Logout successful'}, 200

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return users, 200

class WeightEntries(Resource):
    def get(self):
        user_id = get_current_user_id()
        if not user_id:
            return {'error': 'User not authenticated'}, 401

        weight_entries = WeightEntry.query.filter_by(user_id=user_id).all()
        return [entry.to_dict() for entry in weight_entries], 200

    def post(self):
        user_id = get_current_user_id()
        if not user_id:
            return {'error': 'User not authenticated'}, 401

        data = request.get_json()
        weight = data.get('weight')
        date = data.get('date')

        if not weight or weight <= 0:
            return {'error': 'Invalid weight'}, 400

        if not date:
            date = datetime.utcnow()
        else:
            date = datetime.strptime(date, '%Y-%m-%d')

        # Convert date to Eastern Time
        eastern = pytz.timezone('US/Eastern')
        date = date.astimezone(eastern)

        try:
            new_entry = WeightEntry(user_id=user_id, weight=weight, date=date.strftime('%Y-%m-%d'))
            db.session.add(new_entry)
            db.session.commit()
            return new_entry.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

class UserByID(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()

        if not user:
            return {"errors": ["User not found"]}, 400

        return user.to_dict(), 200

    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"errors": ["User not found"]}, 400

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
            return user.to_dict(), 200
        except Exception as e:
            return {"errors": [str(e)]}, 400

    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"errors": ["User not found"]}, 400

        try:
            db.session.delete(user)
            db.session.commit()
            return {"message": "User deleted successfully"}, 200
        except Exception as e:
            return {"errors": [str(e)]}, 400

# Add resources to API
api.add_resource(HomePage, '/')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')
api.add_resource(Users, '/users')
api.add_resource(UserByID, '/users/<int:id>')
api.add_resource(WeightEntries, '/weight_entries')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
