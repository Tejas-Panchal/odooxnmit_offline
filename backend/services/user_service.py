import os
from extensions import db
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

def create_user(name, email, password, role, login_id, is_verified=False):
    """Creates a new user with a hashed password."""
    try:
        hashed_password = generate_password_hash(password)
        new_user = User(
            user_id=login_id,
            name=name,
            email=email,
            password_hash=hashed_password,
            role=role,
            is_verified=is_verified
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user
    except Exception as e:
        db.session.rollback()
        raise e

def get_user_by_login_id(login_id):
    """Retrieves a user by their login ID."""
    return User.query.filter_by(user_id=login_id).first()

def get_user_by_email(email):
    """Retrieves a user by their email address."""
    return User.query.filter_by(email=email).first()

def check_password(user, password):
    """Verifies a user's password."""
    return check_password_hash(user.password_hash, password)

def update_user_role(user_id, new_role):
    """Updates a user's role."""
    try:
        user = User.query.filter_by(user_id=user_id).first()
        if user:
            user.role = new_role
            db.session.commit()
            return user
        return None
    except Exception as e:
        db.session.rollback()
        raise e