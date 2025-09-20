from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from extensions import db
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    loginId = data.get("loginId")
    role = data.get("role") or "Contact"
    
    print(name)
    print(email)
    print(password)
    print(loginId)
    print(role)

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User email already exists"}), 400

    hashed = generate_password_hash(password)
    
    user = User(
    user_id=loginId,
    name=name,
    email=email,
    password_hash=hashed,
    role=role ,  
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    password = data.get("password")
    loginId = data.get("email")

    user = User.query.filter_by(user_id=loginId).first()
    
    
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid email or password"}), 401
    

    token = create_access_token(identity=str(user.user_id))
    return jsonify({"access_token": token, "username": user.name}), 200