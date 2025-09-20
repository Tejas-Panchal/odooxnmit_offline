from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models.user import User
from extensions import db
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from extensions import db, mail
import random
import datetime
from flask_mail import Message

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    loginId = data.get("loginId")
    role = data.get("role") or "Contact"

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User email already exists"}), 400
    
    if User.query.filter_by(user_id=loginId).first():
        return jsonify({"msg": "Login Id already exists"}), 400
    
    otp_code = str(random.randint(100000, 999999))
    expires = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)
    hashed = bcrypt.generate_password_hash(password).decode('utf-8')
    
    user = User(
    user_id=loginId,
    name=name,
    email=email,
    password_hash=hashed,
    role=role,
    otp=otp_code,
    otp_expires=expires,
    )
    
    try:
        msg = Message("OTP code", recipients=[email])
        msg.body = f"Your OTP code is: {otp_code}"
        mail.send(msg)
    except Exception as e:
        return jsonify({"msg": "Failed to send OTP"}), 500
            
    db.session.add(user)
    db.session.commit()
    

    return jsonify({"msg": "User created and sent OTP"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    password = data.get("password")
    loginId = data.get("email")

    user = User.query.filter_by(user_id=loginId).first()
    
    
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid email or password"}), 401
    

    token = create_access_token(identity=str(user.user_id))
    return jsonify({"access_token": token, "username": user.name, "role": user.role}), 200

@auth_bp.route("/create_user", methods=["POST"])
def create_user():
    data = request.get_json() or {}
    name = data.get("name")
    user_Id=data.get("user_Id")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User email already exists"}), 400

    hashed = generate_password_hash(password)
    
    user = User(
    name=name,
    user_id=user_Id,
    email=email,
    password_hash=hashed,
    role=role,  
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created"}), 201

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp_code = data.get("otp")

    otp_entry = User.query.filter_by(email=email, otp=otp_code).first()

    if not otp_entry:
        return jsonify({"msg": "Invalid OTP"}), 400
    if otp_entry.otp_expires_at < datetime.datetime.utcnow():
        return jsonify({"msg": "OTP expired"}), 400

    # get user
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # success → issue JWT
    access_token = create_access_token(identity=str(user.user_id))

    # set null OTP
    user.otp = None
    user.otp_expires = None
    user.is_verified = True
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "OTP verified", "access_token": access_token}), 200