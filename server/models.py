from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    serialize_rules = ('-workouts.user', '-_password_hash')
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String, nullable=True)
    image_url = db.Column(db.String, nullable=True)
    bio = db.Column(db.String, nullable=True)

    workouts = db.relationship('Workout', back_populates='user', cascade='all, delete-orphan')

    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username cannot be blank.")
        return username

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed.")

    @password_hash.setter
    def password_hash(self, password):
        if not password:
            raise ValueError("Password cannot be blank")
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')
        self._password_hash = hashed_password

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Workout(db.Model, SerializerMixin):
    __tablename__ = "workouts"
    serialize_rules = ('-user.workouts', 'exercises', 'exercises.exercise')
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='workouts')
    exercises = db.relationship('WorkoutExercise', back_populates='workout', cascade='all, delete-orphan')

    @validates('date')
    def validate_date(self, key, date):
        if not date:
            raise ValueError("Date cannot be blank.")
        return date

    @validates('user_id')
    def validate_user_id(self, key, user_id):
        if not user_id:
            raise ValueError("User ID cannot be blank.")
        return user_id

class Exercise(db.Model, SerializerMixin):
    __tablename__ = "exercises"
    serialize_rules = ('-workout_exercises.exercise',)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    workout_exercises = db.relationship('WorkoutExercise', back_populates='exercise')

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Exercise name cannot be blank.")
        return name

class WorkoutExercise(db.Model, SerializerMixin):
    __tablename__ = "workout_exercises"
    serialize_rules = ('-workout.exercises', 'exercise')
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    reps = db.Column(db.Integer, nullable=False)

    workout = db.relationship('Workout', back_populates='exercises')
    exercise = db.relationship('Exercise', back_populates='workout_exercises')

    @validates('weight')
    def validate_weight(self, key, weight):
        if weight <= 0:
            raise ValueError("Weight must be greater than zero.")
        return weight

    @validates('reps')
    def validate_reps(self, key, reps):
        if reps <= 0:
            raise ValueError("Reps must be greater than zero.")
        return reps
