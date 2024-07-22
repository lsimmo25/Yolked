from flask import request, jsonify, session
from flask_restful import Resource, Api
from flask_session import Session

# Local imports
from config import app, db
from models import User, Workout, Exercise, WorkoutExercise, Set

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
        
class Workouts(Resource):
    def get(self):
        user_id = get_current_user_id()

        if not user_id:
            return {'error': 'User not authenticated'}, 401

        workouts = Workout.query.filter_by(user_id=user_id).all()
        workouts_dict = []

        for workout in workouts:
            workout_data = workout.to_dict()
            workout_data['exercises'] = []

            workout_exercises = WorkoutExercise.query.filter_by(workout_id=workout.id).all()
            exercises_dict = {}

            for we in workout_exercises:
                exercise = Exercise.query.get(we.exercise_id)
                if exercise.id not in exercises_dict:
                    exercise_data = exercise.to_dict()
                    exercise_data['sets'] = [set.to_dict() for set in we.sets]
                    exercises_dict[exercise.id] = exercise_data
                else:
                    exercises_dict[exercise.id]['sets'].extend([set.to_dict() for set in we.sets])

            workout_data['exercises'] = list(exercises_dict.values())
            workouts_dict.append(workout_data)

        return workouts_dict, 200

    def post(self):
        user_id = get_current_user_id()

        if not user_id:
            return {'error': 'User not authenticated'}, 401

        data = request.get_json()
        try:
            new_workout = Workout(
                date=data['date'],
                user_id=user_id
            )
            db.session.add(new_workout)
            db.session.commit()

            exercises = data.get('exercises', [])
            for ex in exercises:
                exercise_name = ex.get('name')
                existing_exercise = Exercise.query.filter_by(name=exercise_name).first()
                if not existing_exercise:
                    existing_exercise = Exercise(name=exercise_name)
                    db.session.add(existing_exercise)
                    db.session.commit()

                for set_data in ex.get('sets', []):
                    workout_exercise = WorkoutExercise(
                        workout_id=new_workout.id,
                        exercise_id=existing_exercise.id,
                    )
                    db.session.add(workout_exercise)
                    db.session.commit()

                    new_set = Set(
                        workout_exercise_id=workout_exercise.id,
                        weight=set_data['weight'],
                        reps=set_data['reps']
                    )
                    db.session.add(new_set)
            
            db.session.commit()
            new_workout_data = new_workout.to_dict()
            new_workout_data['exercises'] = []

            workout_exercises = WorkoutExercise.query.filter_by(workout_id=new_workout.id).all()
            exercises_dict = {}
            for we in workout_exercises:
                exercise = Exercise.query.get(we.exercise_id)
                if exercise.id not in exercises_dict:
                    exercise_data = exercise.to_dict()
                    exercise_data['sets'] = [set.to_dict() for set in we.sets]
                    exercises_dict[exercise.id] = exercise_data
                exercises_dict[exercise.id]['sets'] = [set.to_dict() for set in we.sets]

            new_workout_data['exercises'] = list(exercises_dict.values())

            return new_workout_data, 201
        
        except Exception as e:
            db.session.rollback()
            return {'errors': [str(e)]}, 400

class WorkoutByID(Resource):
    def get(self, id):
        workout = Workout.query.filter_by(id=id).first()
        return workout.to_dict(), 200

    def patch(self, id):
        workout = Workout.query.filter_by(id=id).first()
        if not workout:
            return {"errors": ["Workout not found"]}, 400

        data = request.get_json()

        if 'date' in data:
            workout.date = data['date']

        try:
            db.session.commit()
            return workout.to_dict(), 200
        except Exception as e:
            return {"errors": [str(e)]}, 400

    def delete(self, id):
        workout = Workout.query.filter_by(id=id).first()
        if not workout:
            return {"errors": ["Workout not found"]}, 400

        try:
            db.session.delete(workout)
            db.session.commit()
            return {"message": "Workout deleted successfully"}, 200
        except Exception as e:
            return {"errors": [str(e)]}, 400

class Exercises(Resource):
    def get(self):
        exercises = [exercise.to_dict() for exercise in Exercise.query.all()]
        return exercises, 200

    def post(self):
        data = request.get_json()
        try:
            new_exercise = Exercise(
                name=data['name']
            )
            db.session.add(new_exercise)
            db.session.commit()
            return new_exercise.to_dict(), 201
        except Exception as e:
            return {"errors": [str(e)]}, 400

class ExerciseByID(Resource):
    def get(self, id):
        exercise = Exercise.query.filter_by(id=id).first()
        if not exercise:
            return {"errors": ["Exercise not found"]}, 400
        return exercise.to_dict(), 200

    def patch(self, id):
        exercise = Exercise.query.filter_by(id=id).first()
        if not exercise:
            return {"errors": ["Exercise not found"]}, 400

        data = request.get_json()
        if 'name' in data:
            exercise.name = data['name']
        try:
            db.session.commit()
            return exercise.to_dict(), 200
        except Exception as e:
            return {"errors": [str(e)]}, 400

    def delete(self, id):
        exercise = Exercise.query.filter_by(id=id).first()
        if not exercise:
            return {"errors": ["Exercise not found"]}, 400

        try:
            db.session.delete(exercise)
            db.session.commit()
            return {"message": "Exercise deleted successfully"}, 200
        except Exception as e:
            return {"errors": [str(e)]}, 400

class WorkoutExercises(Resource):
    def get(self):
        user_id = get_current_user_id()

        if not user_id:
            return {'error': 'User not authenticated'}, 401
        
        workouts = Workout.query.filter_by(user_id=user_id).all()
        workouts_dict = [workout.to_dict() for workout in workouts]
        return workouts_dict, 200

    def post(self):
        user_id = get_current_user_id()

        if not user_id:
            return {'error': 'User not authenticated'}, 401

        data = request.get_json()
        date = data.get('date')
        exercises = data.get('exercises')

        if not date or not exercises:
            return {'error': 'Missing required fields'}, 400

        try:
            workout = Workout(date=date, user_id=user_id)
            db.session.add(workout)
            db.session.commit()

            for ex in exercises:
                exercise_name = ex.get('name')
                exercise = Exercise.query.filter_by(name=exercise_name).first()
                if not exercise:
                    exercise = Exercise(name=exercise_name)
                    db.session.add(exercise)
                    db.session.commit()

                workout_exercise = WorkoutExercise(
                    workout_id=workout.id,
                    exercise_id=exercise.id,
                )
                db.session.add(workout_exercise)
                db.session.commit()

                for set_data in ex.get('sets', []):
                    weight = set_data.get('weight')
                    reps = set_data.get('reps')
                    if weight is None or reps is None:
                        return {'error': 'Missing set fields'}, 400

                    new_set = Set(
                        workout_exercise_id=workout_exercise.id,
                        weight=weight,
                        reps=reps
                    )
                    db.session.add(new_set)
            
            db.session.commit()
            return workout.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

# Add resources to API
api.add_resource(HomePage, '/')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')
api.add_resource(Users, '/users')
api.add_resource(UserByID, '/users/<int:id>')
api.add_resource(Workouts, '/workouts')
api.add_resource(WorkoutByID, '/workouts/<int:id>')
api.add_resource(Exercises, '/exercises')
api.add_resource(ExerciseByID, '/exercises/<int:id>')
api.add_resource(WorkoutExercises, '/workout_exercises')

if __name__ == '__main__':
    app.run(port=5555, debug=True)