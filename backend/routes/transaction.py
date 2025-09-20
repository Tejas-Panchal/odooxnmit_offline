from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from decimal import Decimal
from datetime import date
from marshmallow import Schema, fields

from extensions import db
# Make sure all your models are imported correctly
from models.purchase_order import PurchaseOrder
from models.purchase_order_item import PurchaseOrderItem
from models.sales_order import SalesOrder
from models.sales_order_item import SalesOrderItem
from models.vendor_bill import VendorBill
from models.customer_invoice import CustomerInvoice

transactions_bp = Blueprint('transactions_v2', __name__)

class VendorBillSchema(Schema):
    bill_id = fields.Int(dump_only=True)
    po_id = fields.Int()
    bill_date = fields.Date()
    due_date = fields.Date()
    total_amount = fields.Decimal(as_string=True)
    status = fields.Str()
    
class CustomerInvoiceSchema(Schema):
    invoice_id = fields.Int(dump_only=True)
    so_id = fields.Int()
    invoice_date = fields.Date()
    due_date = fields.Date()
    total_amount = fields.Decimal(as_string=True)
    status = fields.Str()
    
vendor_bill_schema = VendorBillSchema()
vendor_bills_schema = VendorBillSchema(many=True)

customer_invoice_schema = CustomerInvoiceSchema()
customer_invoices_schema = CustomerInvoiceSchema(many=True)

# --- Purchase Order and Items ---

@transactions_bp.route("/purchase-orders", methods=["POST"])
@jwt_required()
def create_purchase_order_with_items():
    """
    Creates a new Purchase Order AND its line items in a single atomic transaction.
    Expects a JSON payload with order details and a nested list of 'items'.
    """
    data = request.get_json()
    if not data or 'vendor_id' not in data or 'items' not in data:
        return jsonify({"error": "vendor_id and a list of items are required."}), 400

    created_by_user = get_jwt_identity()

    try:
        with db.session.begin():
            # 1. Create the main PurchaseOrder
            new_po = PurchaseOrder(
                vendor_id=data['vendor_id'],
                order_date=data.get('order_date', date.today()),
                status=data.get('status', 'Draft'),
                created_by=created_by_user
            )
            db.session.add(new_po)
            db.session.flush()  # Assigns the po_id to new_po

            # 2. Create the PurchaseOrderItems
            if not data['items']:
                raise ValueError("A purchase order must have at least one item.")

            for item_data in data['items']:
                item = PurchaseOrderItem(
                    po_id=new_po.po_id,
                    product_id=item_data['product_id'],
                    quantity=item_data['quantity'],
                    unit_price=item_data['unit_price'],
                    tax_id=item_data.get('tax_id')
                )
                db.session.add(item)
        
        return jsonify({"msg": "Purchase Order created successfully", "po_id": new_po.po_id}), 201
    
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# --- Sales Order and Items ---

@transactions_bp.route("/sales-orders", methods=["POST"])
@jwt_required()
def create_sales_order_with_items():
    """
    Creates a new Sales Order AND its line items in a single atomic transaction.
    Expects a JSON payload with order details and a nested list of 'items'.
    """
    data = request.get_json()
    if not data or 'customer_id' not in data or 'items' not in data:
        return jsonify({"error": "customer_id and a list of items are required."}), 400

    created_by_user = get_jwt_identity()

    try:
        with db.session.begin():
            # 1. Create the main SalesOrder
            new_so = SalesOrder(
                customer_id=data['customer_id'],
                order_date=data.get('order_date', date.today()),
                status=data.get('status', 'Draft'),
                created_by=created_by_user
            )
            db.session.add(new_so)
            db.session.flush()  # Assigns the so_id to new_so

            # 2. Create the SalesOrderItems
            if not data['items']:
                raise ValueError("A sales order must have at least one item.")
            
            for item_data in data['items']:
                item = SalesOrderItem(
                    so_id=new_so.so_id,
                    product_id=item_data['product_id'],
                    quantity=item_data['quantity'],
                    unit_price=item_data['unit_price'],
                    tax_id=item_data.get('tax_id')
                )
                db.session.add(item)
        
        return jsonify({"msg": "Sales Order created successfully", "so_id": new_so.so_id}), 201

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# --- Create Vendor Bill from Purchase Order ---

@transactions_bp.route("/purchase-orders/<int:po_id>/create-bill", methods=["POST"])
@jwt_required()
def create_bill_from_po(po_id):
    """
    Creates a VendorBill from an existing PurchaseOrder.
    Calculates the total amount from the PO items.
    """
    data = request.get_json()
    if 'due_date' not in data:
        return jsonify({"error": "due_date is required."}), 400

    try:
        with db.session.begin():
            po = db.session.get(PurchaseOrder, po_id)
            if not po:
                return jsonify({"error": "Purchase Order not found."}), 404

            if po.status == 'Billed':
                return jsonify({"error": "A bill has already been created for this PO."}), 409

            # Calculate total amount from PO items
            total_amount = sum(
                Decimal(item.quantity) * Decimal(item.unit_price) for item in po.items
            )
            
            # Create the VendorBill
            new_bill = VendorBill(
                po_id=po.po_id,
                bill_date=data.get('bill_date', date.today()),
                due_date=data['due_date'],
                total_amount=total_amount,
                status='Unpaid'
            )
            db.session.add(new_bill)
            
            # Update the PO status
            po.status = 'Billed'
        
        return jsonify({"msg": "Vendor Bill created successfully", "bill_id": new_bill.bill_id}), 201

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@transactions_bp.route("/vendor-bills/<int:bill_id>", methods=["GET"])
@jwt_required()
def get_vendor_bill(bill_id):
    """
    Retrieves a single vendor bill by its ID.
    """
    try:
        # Fetch the bill from the database using its primary key
        bill = db.session.get(VendorBill, bill_id)

        # If the bill doesn't exist, return a 404 Not Found error
        if not bill:
            return jsonify({"error": "Vendor Bill not found."}), 404

        # Serialize the object to JSON and return it
        return jsonify(vendor_bill_schema.dump(bill)), 200

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@transactions_bp.route("/vendor-bills", methods=["GET"])
@jwt_required()
def get_all_vendor_bills():
    """
    Retrieves a list of all vendor bills.
    """
    try:
        # Query all vendor bills from the database
        all_bills = VendorBill.query.all()

        # Serialize the list of bills to JSON and return it
        return jsonify(vendor_bills_schema.dump(all_bills)), 200

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# --- Create Customer Invoice from Sales Order ---

@transactions_bp.route("/sales-orders/<int:so_id>/create-invoice", methods=["POST"])
@jwt_required()
def create_invoice_from_so(so_id):
    """
    Creates a CustomerInvoice from an existing SalesOrder.
    Calculates the total amount from the SO items.
    """
    data = request.get_json()
    if 'due_date' not in data:
        return jsonify({"error": "due_date is required."}), 400

    try:
        with db.session.begin():
            so = db.session.get(SalesOrder, so_id)
            if not so:
                return jsonify({"error": "Sales Order not found."}), 404

            if so.status == 'Invoiced':
                return jsonify({"error": "An invoice has already been created for this SO."}), 409

            # Calculate total amount from SO items
            total_amount = sum(
                Decimal(item.quantity) * Decimal(item.unit_price) for item in so.items
            )
            
            # Create the CustomerInvoice
            new_invoice = CustomerInvoice(
                so_id=so.so_id,
                invoice_date=data.get('invoice_date', date.today()),
                due_date=data['due_date'],
                total_amount=total_amount,
                status='Unpaid'
            )
            db.session.add(new_invoice)
            
            # Update the SO status
            so.status = 'Invoiced'
        
        return jsonify({"msg": "Customer Invoice created successfully", "invoice_id": new_invoice.invoice_id}), 201

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    
@transactions_bp.route("/customer-invoices/<int:invoice_id>", methods=["GET"])
@jwt_required()
def get_customer_invoice(invoice_id):
    """
    Retrieves a single customer invoice by its ID.
    """
    try:
        # Fetch the invoice from the database by its primary key
        invoice = db.session.get(CustomerInvoice, invoice_id)

        # Return a 404 Not Found error if the invoice doesn't exist
        if not invoice:
            return jsonify({"error": "Customer Invoice not found."}), 404

        # Serialize the object to JSON and return it
        return jsonify(customer_invoice_schema.dump(invoice)), 200

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@transactions_bp.route("/customer-invoices", methods=["GET"])
@jwt_required()
def get_all_customer_invoices():
    """
    Retrieves a list of all customer invoices.
    """
    try:
        # Query all invoices from the database
        all_invoices = CustomerInvoice.query.all()

        # Serialize the list of objects to a JSON array and return it
        return jsonify(customer_invoices_schema.dump(all_invoices)), 200

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500