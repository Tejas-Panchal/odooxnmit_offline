from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.contact import Contact
from models.product import Product
from models.tax import Tax
from models.chart_of_account import ChartOfAccount
from extensions import db
from models.purchase_order import PurchaseOrder
from models.sales_order import SalesOrder
from models.vendor_bill import VendorBill
from models.customer_invoice import CustomerInvoice
from models.payment import Payment
from models.purchase_order_item import PurchaseOrderItem
from models.sales_order_item import SalesOrderItem
from models.stock_leadger import StockLedger

master_bp = Blueprint('master', __name__)

# --- Contact Master APIs ---
@master_bp.route("/contacts", methods=["POST"])
@jwt_required()
def create_contact():
    data = request.get_json()
    created_by = get_jwt_identity()
    new_contact = Contact(name=data['name'], type=data['type'], created_by=created_by, **data)
    db.session.add(new_contact)
    db.session.commit()
    return jsonify({"msg": "Contact created", "id": new_contact.contact_id}), 201

@master_bp.route("/contacts", methods=["GET"])
@jwt_required()
def get_contacts():
    contacts = Contact.query.all()
    result = [{"id": c.contact_id, "name": c.name, "type": c.type} for c in contacts]
    return jsonify(result), 200

# --- Product Master APIs ---
@master_bp.route("/products", methods=["POST"])
@jwt_required()
def create_product():
    data = request.get_json()
    new_product = Product(**data)
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"msg": "Product created", "id": new_product.product_id}), 201

@master_bp.route("/products", methods=["GET"])
@jwt_required()
def get_products():
    products = Product.query.all()
    result = [{"id": p.product_id, "name": p.product_name, "price": str(p.sales_price)} for p in products]
    return jsonify(result), 200

# --- Tax Master APIs ---
@master_bp.route("/taxes", methods=["POST"])
@jwt_required()
def create_tax():
    data = request.get_json()
    new_tax = Tax(**data)
    db.session.add(new_tax)
    db.session.commit()
    return jsonify({"msg": "Tax created", "id": new_tax.tax_id}), 201

# --- Chart of Accounts APIs ---
@master_bp.route("/coa", methods=["POST"])
@jwt_required()
def create_coa_account():
    data = request.get_json()
    new_account = ChartOfAccounts(**data)
    db.session.add(new_account)
    db.session.commit()
    return jsonify({"msg": "Account created", "id": new_account.account_id}), 201