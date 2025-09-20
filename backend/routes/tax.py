from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.product import Product
from models.tax import Tax
from extensions import db

tax_bp = Blueprint("tax", __name__)

@tax_bp.route("/get_taxes", methods=["GET"])
@jwt_required()
def get_taxes():
    try:
        all_taxes = Tax.query.all()
        
        results = [
            {
                "tax_id": tax.tax_id,
                "tax_name": tax.tax_name,
                "computation_method": tax.computation_method,
                "value": tax.value,
                "applicable_on": tax.applicable_on
            } for tax in all_taxes
        ]
        
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@tax_bp.route("/create_tax", methods=["POST"])
@jwt_required()
def create_tax():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    required_fields = ["tax_name", "computation_method", "value", "applicable_on"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Field '{field}' is required"}), 400
    
    if data["computation_method"] not in ["Fixed", "Percentage"]:
        return jsonify({"error": "Invalid computation method"}), 400
    
    if data["applicable_on"] not in ["Sales", "Purchase", "Both"]:
        return jsonify({"error": "Invalid applicable_on field"}), 400
    
    if Tax.query.filter_by(tax_name=data["tax_name"]).first():
        return jsonify({"error": "Tax name already exists"}), 400
    
    try:
        new_tax = Tax(
            tax_name = data["tax_name"],
            computation_method = data["computation_method"],
            value = data["value"],
            applicable_on = data["applicable_on"]
        )
        
        db.session.add(new_tax)
        db.session.commit()
        
        return jsonify({"msg": "Tax created", "id": new_tax.tax_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500