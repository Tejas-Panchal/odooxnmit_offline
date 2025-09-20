from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# Assuming a SalesOrder model exists, let's import it.
from models.sales_order import SalesOrder 

from models.purchase_order import PurchaseOrder
from models.vendor_bill import VendorBill
from models.customer_invoice import CustomerInvoice
from models.payment import Payment
from models.purchase_order_item import PurchaseOrderItem
from models.sales_order_item import SalesOrderItem
from models.stock_leadger import StockLedger
from extensions import db

transactions_bp = Blueprint('transactions', __name__)

# --- Purchase Order APIs ---
@transactions_bp.route("/purchase-orders", methods=["POST"])
@jwt_required()
def create_po():
    data = request.get_json()
    created_by = get_jwt_identity()

    # <-- FIX: Explicitly map fields to prevent mass assignment vulnerability and argument collision.
    new_po = PurchaseOrder(
        vendor_id=data.get('vendor_id'),
        order_date=data.get('order_date'), # Assuming a date field
        status='pending', # <-- It's better to set a default status on the server.
        created_by=created_by
    )
    db.session.add(new_po)
    db.session.flush() # <-- Flush to get the new_po.po_id before committing.

    po_items = []
    for item_data in data.get('items', []):
        po_item = PurchaseOrderItem(
            po_id=new_po.po_id, # <-- Use the ID from the flushed object.
            product_id=item_data.get('product_id'),
            quantity=item_data.get('quantity'),
            unit_price=item_data.get('unit_price')
        )
        po_items.append(po_item)

    db.session.add_all(po_items)
    
    # <-- FIX: Commit only ONCE after all operations are successful.
    db.session.commit() 
    
    return jsonify({"msg": "PO created", "id": new_po.po_id}), 201

# --- Sales Order APIs ---
@transactions_bp.route("/sales-orders", methods=["POST"])
@jwt_required()
def create_so():
    data = request.get_json()
    created_by = get_jwt_identity()

    # <-- FIX: Use the correct `SalesOrder` model, not `SalesOrderItem`.
    new_so = SalesOrder( 
        customer_id=data.get('customer_id'),
        so_date=data.get('so_date'),
        total_amount=data.get('total_amount'),
        status='pending',
        created_by=created_by # <-- FIX: Use the created_by variable.
    )
    db.session.add(new_so)
    db.session.flush() # <-- Flush to get the new_so.so_id.

    so_items = []
    for item_data in data.get('items', []):
        so_item = SalesOrderItem(
            so_id=new_so.so_id, # <-- Use the ID from the flushed object.
            product_id=item_data.get('product_id'),
            quantity=item_data.get('quantity'),
            unit_price=item_data.get('unit_price')
        )
        so_items.append(so_item)

    db.session.add_all(so_items)
    
    # <-- FIX: Commit only ONCE.
    db.session.commit()
    
    return jsonify({"msg": "SO created", "id": new_so.so_id}), 201

# --- Vendor Bill APIs ---
@transactions_bp.route("/vendor-bills", methods=["POST"])
@jwt_required()
def create_vendor_bill():
    data = request.get_json()
    created_by = get_jwt_identity()

    # <-- FIX: Explicitly map fields to prevent mass assignment.
    new_bill = VendorBill(
        po_id=data.get('po_id'),
        vendor_id=data.get('vendor_id'),
        bill_date=data.get('bill_date'),
        amount=data.get('amount'),
        created_by=created_by # <-- FIX: Make logic consistent.
    )
    db.session.add(new_bill)
    db.session.commit()
    return jsonify({"msg": "Vendor Bill created", "id": new_bill.bill_id}), 201

# --- Customer Invoice APIs ---
@transactions_bp.route("/customer-invoices", methods=["POST"])
@jwt_required()
def create_customer_invoice():
    data = request.get_json()
    created_by = get_jwt_identity()

    # <-- FIX: Explicitly map fields.
    new_invoice = CustomerInvoice(
        so_id=data.get('so_id'),
        customer_id=data.get('customer_id'),
        invoice_date=data.get('invoice_date'),
        amount=data.get('amount'),
        created_by=created_by
    )
    db.session.add(new_invoice)
    db.session.commit()
    return jsonify({"msg": "Customer Invoice created", "id": new_invoice.invoice_id}), 201

# --- Payment APIs ---
@transactions_bp.route("/payments", methods=["POST"])
@jwt_required()
def record_payment():
    data = request.get_json()
    created_by = get_jwt_identity()

    # <-- FIX: Explicitly map fields.
    new_payment = Payment(
        invoice_id=data.get('invoice_id'), # Can be invoice or bill
        bill_id=data.get('bill_id'),
        payment_date=data.get('payment_date'),
        amount=data.get('amount'),
        payment_method=data.get('payment_method'),
        recorded_by=created_by # Assuming a 'recorded_by' field
    )
    db.session.add(new_payment)
    db.session.commit()
    return jsonify({"msg": "Payment recorded", "id": new_payment.payment_id}), 201