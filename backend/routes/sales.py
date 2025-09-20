from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.sales_order import SalesOrder
from models.sales_order_item import SalesOrderItem
from models.customer_invoice import CustomerInvoice

sales_bp = Blueprint('sales', __name__)

# --- API to create a new Sales Order ---
@sales_bp.route("/sales-orders", methods=["POST"])
@jwt_required()
def create_sales_order():
    """
    Creates a new sales order and its associated line items.
    Expects JSON data with customer_id, order_date, and a list of items.
    """
    data = request.get_json()
    created_by = get_jwt_identity()
    
    # 1. Create the Sales Order record
    new_so = SalesOrder(
        customer_id=data['customer_id'],
        order_date=data['order_date'],
        status='Draft',
        created_by=created_by
    )
    db.session.add(new_so)
    db.session.commit()
    
    # 2. Add the items to the Sales Order
    for item_data in data.get('items', []):
        new_item = SalesOrderItem(
            so_id=new_so.so_id,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            unit_price=item_data['unit_price'],
            tax_id=item_data['tax_id']
        )
        db.session.add(new_item)
    
    db.session.commit()
    return jsonify({"msg": "Sales Order created successfully", "so_id": new_so.so_id}), 201

# --- API to get a list of all Sales Orders ---
@sales_bp.route("/sales-orders", methods=["GET"])
@jwt_required()
def get_sales_orders():
    """
    Retrieves a list of all sales orders.
    """
    sales_orders = SalesOrder.query.all()
    result = []
    for so in sales_orders:
        result.append({
            "so_id": so.so_id,
            "customer_id": so.customer_id,
            "order_date": so.order_date.isoformat(),
            "status": so.status
        })
    return jsonify(result), 200

# --- API to convert a Sales Order into a Customer Invoice ---
@sales_bp.route("/sales-orders/<int:so_id>/convert-to-invoice", methods=["POST"])
@jwt_required()
def convert_so_to_invoice(so_id):
    """
    Converts a specific Sales Order to a Customer Invoice.
    Automatically calculates the total amount.
    """
    so = SalesOrder.query.get_or_404(so_id)
    if so.status == 'Invoiced':
        return jsonify({"msg": "Sales Order is already invoiced."}), 400
        
    # Calculate total amount from sales order items
    total_amount = 0
    for item in so.items:
        total_amount += item.quantity * item.unit_price
    
    # Create the new Customer Invoice record
    new_invoice = CustomerInvoice(
        so_id=so.so_id,
        invoice_date=so.order_date, # Or a separate field for invoice date
        due_date=so.order_date,     # Or logic for a later due date
        total_amount=total_amount,
        status='Unpaid'
    )
    db.session.add(new_invoice)
    
    # Update the status of the original Sales Order
    so.status = 'Invoiced'
    db.session.commit()
    
    return jsonify({"msg": "Invoice created successfully", "invoice_id": new_invoice.invoice_id}), 201