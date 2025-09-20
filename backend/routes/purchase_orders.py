from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.purchase_order import PurchaseOrder
from models.purchase_order_item import PurchaseOrderItem
from models.contact import Contact # To validate vendor_id
from models.product import Product # To validate product_id
from extensions import db
from datetime import date

po_bp = Blueprint("purchase_orders", __name__)

# --- Helper function for serialization ---
def serialize_po(po):
    """Converts a PurchaseOrder object into a dictionary."""
    return {
        "po_id": po.po_id,
        "vendor_id": po.vendor_id,
        "order_date": po.order_date.isoformat(),
        "status": po.status,
        "created_by": po.created_by,
        "items": [
            {
                "po_item_id": item.po_item_id,
                "product_id": item.product_id,
                "quantity": float(item.quantity),
                "unit_price": float(item.unit_price),
                "tax_id": item.tax_id
            }
            for item in po.items
        ]
    }

# --- 1. CREATE a new Purchase Order ---
@po_bp.route("/purchase-orders", methods=["POST"])
@jwt_required()
def create_purchase_order():
    """
    Creates a new purchase order along with its line items.
    Expects a JSON body with vendor_id and a list of items.
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()

    # --- Validation ---
    if not data or not data.get("vendor_id") or not data.get("items"):
        return jsonify({"error": "vendor_id and a non-empty list of items are required."}), 400

    if not isinstance(data["items"], list) or len(data["items"]) == 0:
        return jsonify({"error": "'items' must be a non-empty list."}), 400
    
    # Check if vendor exists and is a Vendor/Both
    vendor = Contact.query.filter_by(contact_id=data.get("vendor_id")).first()
    if not vendor or vendor.type not in ['Vendor', 'Both']:
        return jsonify({"error": f"Vendor with ID {data.get('vendor_id')} not found."}), 404

    try:
        # Create the main PO object
        new_po = PurchaseOrder(
            vendor_id=data["vendor_id"],
            order_date=date.fromisoformat(data["order_date"]) if data.get("order_date") else date.today(),
            status=data.get("status", "Draft"),
            created_by=current_user_id
        )

        # Create and associate item objects
        for item_data in data["items"]:
            if not all(k in item_data for k in ["product_id", "quantity", "unit_price"]):
                 raise ValueError("Each item must have product_id, quantity, and unit_price.")
            
            product = Product.query.get(item_data["product_id"])
            if not product:
                return jsonify({"error": f"Product with ID {item_data['product_id']} not found."}), 404

            item = PurchaseOrderItem(
                product_id=item_data["product_id"],
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                tax_id=item_data.get("tax_id")
            )
            new_po.items.append(item) # Append to the relationship list

        db.session.add(new_po)
        db.session.commit()

        return jsonify(serialize_po(new_po)), 201

    except (ValueError, TypeError) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred", "details": str(e)}), 500


# --- 2. READ all Purchase Orders (with filtering) ---
@po_bp.route("/purchase-orders", methods=["GET"])
@jwt_required()
def get_purchase_orders():
    """Retrieves all purchase orders, optionally filtered by vendor or status."""
    query = PurchaseOrder.query
    
    # Optional filters
    vendor_id = request.args.get("vendor_id")
    status = request.args.get("status")
    
    if vendor_id:
        query = query.filter_by(vendor_id=vendor_id)
    if status:
        query = query.filter_by(status=status)
        
    all_pos = query.order_by(PurchaseOrder.order_date.desc()).all()
    
    return jsonify([serialize_po(po) for po in all_pos]), 200


# --- 3. READ a single Purchase Order ---
@po_bp.route("/purchase-orders/<int:po_id>", methods=["GET"])
@jwt_required()
def get_purchase_order(po_id):
    """Retrieves a specific purchase order by its ID."""
    po = PurchaseOrder.query.get_or_404(po_id)
    return jsonify(serialize_po(po)), 200


# --- 4. UPDATE a Purchase Order ---
@po_bp.route("/purchase-orders/<int:po_id>", methods=["PUT"])
@jwt_required()
def update_purchase_order(po_id):
    """
    Updates a purchase order's details and its items.
    The entire new state of the object should be sent.
    """
    po = PurchaseOrder.query.get_or_404(po_id)
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body cannot be empty."}), 400

    # For safety, you might want to restrict updates on closed/billed orders
    if po.status not in ["Draft", "Sent"]:
        return jsonify({"error": f"Cannot update a purchase order with status '{po.status}'."}), 403

    try:
        # Update parent object fields
        po.vendor_id = data.get("vendor_id", po.vendor_id)
        po.order_date = date.fromisoformat(data["order_date"]) if data.get("order_date") else po.order_date
        po.status = data.get("status", po.status)

        # Handle items: The easiest and safest way is to clear and re-add them.
        if "items" in data:
            po.items.clear() # Clear existing items
            for item_data in data["items"]:
                item = PurchaseOrderItem(
                    product_id=item_data["product_id"],
                    quantity=item_data["quantity"],
                    unit_price=item_data["unit_price"],
                    tax_id=item_data.get("tax_id")
                )
                po.items.append(item)
        
        db.session.commit()
        return jsonify(serialize_po(po)), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Update failed", "details": str(e)}), 500


# --- 5. DELETE a Purchase Order ---
@po_bp.route("/purchase-orders/<int:po_id>", methods=["DELETE"])
@jwt_required()
def delete_purchase_order(po_id):
    """Deletes a purchase order. All associated items will be deleted due to cascading."""
    po = PurchaseOrder.query.get_or_404(po_id)
    
    # Optional: Add business logic, e.g., cannot delete an approved PO
    if po.status != 'Draft':
        return jsonify({"error": "Only purchase orders in 'Draft' status can be deleted."}), 403

    try:
        db.session.delete(po)
        db.session.commit()
        return jsonify({"message": f"Purchase Order {po_id} deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Delete failed", "details": str(e)}), 500