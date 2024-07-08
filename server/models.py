from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property

from config import db

class User(db.model, SerializerMixin):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Integer)
    _password_hash = db.Column(db.String, nullable=True)
    image_url = db.Column(db.String, nullable=True)
    bio = db.Column(db.String, nullable=True)

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

class Workout(db.model, SerializerMixin):
    
    __tablename__ = "workouts"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    exercise = db.Column(db.String, nullable=False)
    weight = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)

