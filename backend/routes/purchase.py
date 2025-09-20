from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.purchase_order import PurchaseOrder
from models.purchase_order_item import PurchaseOrderItem
from models.vendor_bill import VendorBill

purchase_bp = Blueprint('purchase', __name__)

# --- API to create a new Purchase Order ---
@purchase_bp.route("/purchase-orders", methods=["POST"])
@jwt_required()
def create_purchase_order():
    """
    Creates a new purchase order and its associated line items.
    Expects JSON data with vendor_id, order_date, and a list of items.
    """
    data = request.get_json()
    created_by = get_jwt_identity()
    
    # 1. Create the Purchase Order record
    new_po = PurchaseOrder(
        vendor_id=data['vendor_id'],
        order_date=data['order_date'],
        status='Draft',
        created_by=created_by
    )
    db.session.add(new_po)
    db.session.commit()
    
    # 2. Add the items to the Purchase Order
    for item_data in data.get('items', []):
        new_item = PurchaseOrderItem(
            po_id=new_po.po_id,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            unit_price=item_data['unit_price'],
            tax_id=item_data['tax_id']
        )
        db.session.add(new_item)
    
    db.session.commit()
    return jsonify({"msg": "Purchase Order created successfully", "po_id": new_po.po_id}), 201

# --- API to get a list of all Purchase Orders ---
@purchase_bp.route("/purchase-orders", methods=["GET"])
@jwt_required()
def get_purchase_orders():
    """
    Retrieves a list of all purchase orders.
    """
    purchase_orders = PurchaseOrder.query.all()
    result = []
    for po in purchase_orders:
        result.append({
            "po_id": po.po_id,
            "vendor_id": po.vendor_id,
            "order_date": po.order_date.isoformat(),
            "status": po.status
        })
    return jsonify(result), 200

# --- API to convert a Purchase Order into a Vendor Bill ---
@purchase_bp.route("/purchase-orders/<int:po_id>/convert-to-bill", methods=["POST"])
@jwt_required()
def convert_po_to_bill(po_id):
    """
    Converts a specific Purchase Order to a Vendor Bill.
    Automatically calculates the total amount.
    """
    po = PurchaseOrder.query.get_or_404(po_id)
    if po.status == 'Billed':
        return jsonify({"msg": "Purchase Order is already billed."}), 400
        
    # Calculate total amount from purchase order items
    total_amount = 0
    for item in po.items:
        total_amount += item.quantity * item.unit_price
    
    # Create the new Vendor Bill record
    new_bill = VendorBill(
        po_id=po.po_id,
        bill_date=po.order_date, # Or a separate field for bill date
        due_date=po.order_date,   # Or logic for a later due date
        total_amount=total_amount,
        status='Unpaid'
    )
    db.session.add(new_bill)
    
    # Update the status of the original Purchase Order
    po.status = 'Billed'
    db.session.commit()
    
    return jsonify({"msg": "Vendor Bill created successfully", "bill_id": new_bill.bill_id}), 201