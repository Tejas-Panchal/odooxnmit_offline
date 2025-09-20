# In routes/reports.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from models.contact import Contact
from models.customer_invoice import CustomerInvoice
from models.vendor_bill import VendorBill
from models.payment import Payment
from models.product import Product
from models.sales_order import SalesOrder
from models.purchase_order import PurchaseOrder
from models.stock_leadger import StockLedger
from extensions import db

reports_bp = Blueprint('reports', __name__)

# (All your other report APIs remain the same)

@reports_bp.route("/partner-ledger/<int:contact_id>", methods=["GET"])
@jwt_required()
def get_partner_ledger(contact_id):
    """
    Generates a ledger of all transactions for a specific contact.
    Combines invoices, bills, and payments related to the contact.
    """
    contact = Contact.query.get_or_404(contact_id)
    all_transactions = []

    # Check if the contact is a Customer or Both
    if contact.type in ['Customer', 'Both']:
        # Fetch Invoices and their associated payments
        invoices = db.session.query(
            CustomerInvoice.invoice_id.label('ref_id'),
            CustomerInvoice.invoice_date.label('date'),
            CustomerInvoice.total_amount.label('amount'),
            db.literal('Invoice').label('type')
        ).join(SalesOrder, CustomerInvoice.so_id == SalesOrder.so_id).filter(SalesOrder.customer_id == contact_id).all()
        
        all_transactions.extend(invoices)

        invoice_payments = db.session.query(
            Payment.payment_id.label('ref_id'),
            Payment.payment_date.label('date'),
            (Payment.amount * -1).label('amount'), # Payments reduce the balance
            db.literal('Payment').label('type')
        ).filter(Payment.related_type == 'Invoice', Payment.related_id.in_([i.ref_id for i in invoices])).all()

        all_transactions.extend(invoice_payments)

    # Check if the contact is a Vendor or Both
    if contact.type in ['Vendor', 'Both']:
        # Fetch Bills and their associated payments
        bills = db.session.query(
            VendorBill.bill_id.label('ref_id'),
            VendorBill.bill_date.label('date'),
            (VendorBill.total_amount * -1).label('amount'), # Bills are expenses, so negative
            db.literal('Bill').label('type')
        ).join(PurchaseOrder, VendorBill.po_id == PurchaseOrder.po_id).filter(PurchaseOrder.vendor_id == contact_id).all()

        all_transactions.extend(bills)
        
        bill_payments = db.session.query(
            Payment.payment_id.label('ref_id'),
            Payment.payment_date.label('date'),
            (Payment.amount * 1).label('amount'), # Bill payments are positive to reduce liability
            db.literal('Payment').label('type')
        ).filter(Payment.related_type == 'Bill', Payment.related_id.in_([b.ref_id for b in bills])).all()
        
        all_transactions.extend(bill_payments)

    # Combine and sort all transactions by date
    all_transactions.sort(key=lambda x: x.date)

    # Calculate running balance
    running_balance = 0
    ledger_entries = []
    for trx in all_transactions:
        running_balance += trx.amount
        ledger_entries.append({
            'ref_id': trx.ref_id,
            'date': trx.date.isoformat(),
            'type': trx.type,
            'amount': float(trx.amount),
            'balance': float(running_balance)
        })

    response = {
        "contact_name": contact.name,
        "ledger_entries": ledger_entries
    }
    return jsonify(response), 200