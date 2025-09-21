from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User  # Assuming you have this model
from extensions import db, mail # Assuming you have these extensions
from flask_jwt_extended import create_access_token, jwt_required
from flask_mail import Message
import random
import datetime
import re
import dns.resolver

# --- Blueprint Setup ---
auth_bp = Blueprint("auth", __name__)


# --- Helper Function for Email Validation ---
def is_valid_email(email):
    """
    Checks if an email is syntactically valid and if its domain has MX records.
    """
    # 1. Syntax Check using Regex
    if not re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email):
        return False

    # 2. Domain Check using DNS MX records
    try:
        domain = email.split('@')[1]
        # Query for MX (Mail Exchange) records
        records = dns.resolver.resolve(domain, 'MX')
        # If records are found, the domain can receive emails
        return len(records) > 0
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.resolver.NoNameservers, dns.exception.Timeout):
        # These exceptions mean the domain is not configured for email
        return False
    except Exception:
        # Catch any other potential errors
        return False


# --- Routes ---

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    loginId = data.get("loginId")
    role = data.get("role") or "Contact"

    # --- New Validation Step ---
    if not email or not is_valid_email(email):
        return jsonify({"msg": "InvalidEmail"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User email already exists"}), 400

    otp_code = str(random.randint(100000, 999999))
    expires = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)
    hashed = generate_password_hash(password)

    user = User(
        user_id=loginId,
        name=name,
        email=email,
        password_hash=hashed,
        role=role,
        otp=otp_code,
        otp_expires=expires,
        is_verified=False # Start as not verified
    )

    db.session.add(user)
    db.session.commit()

    try:
        msg = Message("Your OTP Code for Shiv Accounts Cloud", recipients=[email])
        msg.body = f"Hello {name},\n\nYour One-Time Password (OTP) is: {otp_code}\n\nThis code will expire in 5 minutes."
        mail.send(msg)
    except Exception as e:
        # If mail fails, it's good practice to log it and inform the user
        print(f"Error sending email: {e}")
        return jsonify({"msg": "User created, but failed to send OTP. Please try again later."}), 500


    return jsonify({"msg": "User created and OTP sent successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    password = data.get("password")
    # Allowing login with either email or user_id for flexibility
    login_identifier = data.get("email") # Assuming frontend sends email/loginId in this field

    # Find user by either user_id or email
    user = User.query.filter((User.user_id == login_identifier) | (User.email == login_identifier)).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid credentials"}), 401
    
    if not user.is_verified:
        return jsonify({"msg": "Account not verified. Please verify your OTP first."}), 403

    token = create_access_token(identity=str(user.user_id))
    return jsonify({"access_token": token, "username": user.name, "role": user.role}), 200

@auth_bp.route("/create_user", methods=["POST"])
@jwt_required() # Assuming only authenticated users can create other users
def create_user():
    data = request.get_json() or {}
    name = data.get("name")
    user_Id = data.get("user_Id")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    # --- New Validation Step ---
    if not email or not is_valid_email(email):
        return jsonify({"msg": "Please provide a valid and deliverable email address."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User email already exists"}), 400
    
    if User.query.filter_by(user_id=user_Id).first():
        return jsonify({"msg": "User ID already exists"}), 400

    hashed = generate_password_hash(password)

    user = User(
        name=name,
        user_id=user_Id,
        email=email,
        password_hash=hashed,
        role=role,
        is_verified=True # Assuming users created by an admin are pre-verified
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp_code = data.get("otp")

    # Correct field name from your original code
    user = User.query.filter_by(email=email, otp=otp_code).first()

    if not user:
        return jsonify({"msg": "Invalid OTP or email"}), 400
    
    # Correct field name from your original code
    if user.otp_expires < datetime.datetime.utcnow():
        # Clear the expired OTP
        user.otp = None
        user.otp_expires = None
        db.session.commit()
        return jsonify({"msg": "OTP has expired. Please register again to get a new one."}), 400

    # --- Success: Verify user and clear OTP fields ---
    user.is_verified = True
    user.otp = None
    user.otp_expires = None
    db.session.commit()

    # Issue JWT token upon successful verification
    access_token = create_access_token(identity=str(user.user_id))

    return jsonify({"msg": "OTP verified successfully. Your account is now active.", "access_token": access_token}), 200