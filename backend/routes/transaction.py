from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, PurchaseOrder, SalesOrder, VendorBill, CustomerInvoice, Payment, PurchaseOrderItems, SalesOrderItems, StockLedger

transactions_bp = Blueprint('transactions', __name__)

# --- Purchase Order APIs ---
@transactions_bp.route("/purchase-orders", methods=["POST"])
@jwt_required()
def create_po():
    data = request.get_json()
    created_by = get_jwt_identity()
    new_po = PurchaseOrder(vendor_id=data['vendor_id'], created_by=created_by, **data)
    db.session.add(new_po)
    db.session.commit()
    for item_data in data.get('items', []):
        po_item = PurchaseOrderItems(po_id=new_po.po_id, **item_data)
        db.session.add(po_item)
    db.session.commit()
    return jsonify({"msg": "PO created", "id": new_po.po_id}), 201

# --- Sales Order APIs ---
@transactions_bp.route("/sales-orders", methods=["POST"])
@jwt_required()
def create_so():
    data = request.get_json()
    created_by = get_jwt_identity()
    new_so = SalesOrder(customer_id=data['customer_id'], created_by=created_by, **data)
    db.session.add(new_so)
    db.session.commit()
    for item_data in data.get('items', []):
        so_item = SalesOrderItems(so_id=new_so.so_id, **item_data)
        db.session.add(so_item)
    db.session.commit()
    return jsonify({"msg": "SO created", "id": new_so.so_id}), 201

# --- Vendor Bill APIs ---
@transactions_bp.route("/vendor-bills", methods=["POST"])
@jwt_required()
def create_vendor_bill():
    data = request.get_json()
    new_bill = VendorBill(**data)
    db.session.add(new_bill)
    db.session.commit()
    return jsonify({"msg": "Vendor Bill created", "id": new_bill.bill_id}), 201

# --- Customer Invoice APIs ---
@transactions_bp.route("/customer-invoices", methods=["POST"])
@jwt_required()
def create_customer_invoice():
    data = request.get_json()
    new_invoice = CustomerInvoice(**data)
    db.session.add(new_invoice)
    db.session.commit()
    return jsonify({"msg": "Customer Invoice created", "id": new_invoice.invoice_id}), 201

# --- Payment APIs ---
@transactions_bp.route("/payments", methods=["POST"])
@jwt_required()
def record_payment():
    data = request.get_json()
    new_payment = Payment(**data)
    db.session.add(new_payment)
    db.session.commit()
    return jsonify({"msg": "Payment recorded", "id": new_payment.payment_id}), 201