from flask import Blueprint, request, jsonify
from models.chart_of_account import ChartOfAccount # Import your model
from extensions import db

coa_bp = Blueprint("chart_of_accounts", __name__)

# Helper function to convert a model object to a dictionary
def account_to_dict(account):
    return {
        "account_id": account.account_id,
        "account_name": account.account_name,
        "account_type": account.account_type,
    }

# --- CREATE an Account ---
@coa_bp.route("/accounts", methods=["POST"])
def create_account():
    """Creates a new account in the chart of accounts."""
    data = request.get_json()
    if not data or not data.get("account_name") or not data.get("account_type"):
        return jsonify({"error": "Fields 'account_name' and 'account_type' are required."}), 400

    # Check for duplicate account name
    if ChartOfAccount.query.filter_by(account_name=data["account_name"]).first():
        return jsonify({"error": f"An account with the name '{data['account_name']}' already exists."}), 409

    try:
        new_account = ChartOfAccount(
            account_name=data["account_name"],
            account_type=data["account_type"]
        )
        db.session.add(new_account)
        db.session.commit()
        return jsonify(account_to_dict(new_account)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

# --- READ all Accounts ---
@coa_bp.route("/accounts", methods=["GET"])
def get_all_accounts():
    """Retrieves a list of all accounts."""
    accounts = ChartOfAccount.query.order_by(ChartOfAccount.account_name).all()
    return jsonify([account_to_dict(acc) for acc in accounts]), 200

# --- READ a Single Account ---
@coa_bp.route("/accounts/<int:account_id>", methods=["GET"])
def get_account(account_id):
    """Retrieves a single account by its ID."""
    account = ChartOfAccount.query.get_or_404(account_id)
    return jsonify(account_to_dict(account)), 200

# --- UPDATE an Account ---
@coa_bp.route("/accounts/<int:account_id>", methods=["PUT"])
def update_account(account_id):
    """Updates an existing account's details."""
    account = ChartOfAccount.query.get_or_404(account_id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    # Check if the new name is a duplicate
    new_name = data.get("account_name")
    if new_name and new_name != account.account_name:
        if ChartOfAccount.query.filter_by(account_name=new_name).first():
            return jsonify({"error": f"An account with the name '{new_name}' already exists."}), 409

    try:
        account.account_name = data.get("account_name", account.account_name)
        account.account_type = data.get("account_type", account.account_type)
        db.session.commit()
        return jsonify(account_to_dict(account)), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

# --- DELETE an Account ---
@coa_bp.route("/accounts/<int:account_id>", methods=["DELETE"])
def delete_account(account_id):
    """Deletes an account."""
    account = ChartOfAccount.query.get_or_404(account_id)
    try:
        db.session.delete(account)
        db.session.commit()
        return jsonify({"message": f"Account '{account.account_name}' deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500