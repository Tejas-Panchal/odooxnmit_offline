from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from models.contact import Contact
from models.customer_invoice import CustomerInvoice
from models.vendor_bill import VendorBill
from models.payment import Payment
from models.product import Product
from models.stock_leadger import StockLedger
from extensions import db

reports_bp = Blueprint('reports', __name__)

@reports_bp.route("/balance-sheet", methods=["GET"])
@jwt_required()
def get_balance_sheet():
    """
    Generates a real-time Balance Sheet report.
    Calculates Assets (receivables, cash) and Liabilities (payables).
    """
    total_receivable = db.session.query(func.sum(CustomerInvoice.total_amount)).filter_by(status='Unpaid').scalar()
    total_cash_bank = db.session.query(func.sum(Payment.amount)).scalar()
    total_payable = db.session.query(func.sum(VendorBill.total_amount)).filter_by(status='Unpaid').scalar()

    report = {
        "assets": {
            "accounts_receivable": float(total_receivable or 0),
            "cash_and_bank": float(total_cash_bank or 0)
        },
        "liabilities": {
            "accounts_payable": float(total_payable or 0)
        }
    }
    return jsonify(report), 200

@reports_bp.route("/profit-and-loss", methods=["GET"])
@jwt_required()
def get_pnl():
    """
    Generates a Profit & Loss statement.
    Calculates net profit by subtracting total expenses from total income.
    """
    total_sales = db.session.query(func.sum(CustomerInvoice.total_amount)).scalar()
    total_purchases = db.session.query(func.sum(VendorBill.total_amount)).scalar()
    net_profit = (total_sales or 0) - (total_purchases or 0)

    report = {
        "income": float(total_sales or 0),
        "expenses": float(total_purchases or 0),
        "net_profit": float(net_profit)
    }
    return jsonify(report), 200

@reports_bp.route("/stock-statement", methods=["GET"])
@jwt_required()
def get_stock_statement():
    """
    Generates an inventory/stock report.
    Calculates the current stock level for each product based on ledger movements.
    """
    stock_levels = db.session.query(
        Product.product_name,
        func.sum(StockLedger.quantity).label('current_stock')
    ).join(StockLedger).group_by(Product.product_name).all()

    result = [{"product_name": name, "current_stock": float(stock)} for name, stock in stock_levels]
    return jsonify(result), 200

@reports_bp.route("/partner-ledger/<int:contact_id>", methods=["GET"])
@jwt_required()
def get_partner_ledger(contact_id):
    """
    Generates a ledger of all transactions for a specific contact.
    Combines invoices, bills, and payments related to the contact.
    """
    contact = Contact.query.get_or_404(contact_id)

    # Fetch Invoices and Bills
    invoices = db.session.query(
        CustomerInvoice.invoice_id.label('ref_id'),
        CustomerInvoice.invoice_date.label('date'),
        CustomerInvoice.total_amount.label('amount'),
        db.literal('Invoice').label('type')
    ).filter(CustomerInvoice.so.has(customer_id=contact_id))

    bills = db.session.query(
        VendorBill.bill_id.label('ref_id'),
        VendorBill.bill_date.label('date'),
        (VendorBill.total_amount * -1).label('amount'), # Bills are expenses, so negative
        db.literal('Bill').label('type')
    ).filter(VendorBill.po.has(vendor_id=contact_id))
    
    # Combine and sort all transactions
    all_transactions = invoices.union_all(bills).order_by('date').all()
    
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