from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.contact import Contact
from extensions import db

contact_bp = Blueprint("contact", __name__)

@contact_bp.route("/contacts", methods=["POST"])
@jwt_required()
def create_contact():
    current_user_id = get_jwt_identity()
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    name = data.get("name")
    contact_type = data.get("type")
    
    if not name or not contact_type:
        return jsonify({"error": "Name and type are required"}), 400
    
    if contact_type not in ["Customer", "Vendor", "Both"]:
        return jsonify({"error": "Invalid contact type"}), 400
    
    if Contact.query.filter_by(name=name, created_by=current_user_id).first():
        return jsonify({"error": "Contact name already exists"}), 409
    
    try:
        new_contact = Contact(
            name = name,
            type = contact_type,
            email = data.get("email"),
            mobile = data.get("mobile"),
            address = data.get("address"),
            city = data.get("city"),
            state = data.get("state"),
            pincode = data.get("pincode"),
            profile_image = data.get("profile_image"),
            created_by = current_user_id
        )
        
        db.session.add(new_contact)
        db.session.commit()
        
        return jsonify({
            "message": "Contact created successfully!",
            "contact_id": new_contact.contact_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@contact_bp.route("/contacts", methods=["GET"])
@jwt_required()
def get_contacts():
    current_user_id = get_jwt_identity()
    contacts = Contact.query.filter_by(created_by=current_user_id).all()
    result = [{
        "contact_id": c.contact_id,
        "name": c.name,
        "email": c.email,
        "mobile": c.mobile,
        "address": c.address,
        "city": c.city,
        "state": c.state,
        "pincode": c.pincode,
        "profile_image": c.profile_image
    } for c in contacts]
    return jsonify(result), 200