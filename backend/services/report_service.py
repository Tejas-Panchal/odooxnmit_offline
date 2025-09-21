from extensions import db
from models.customer_invoice import CustomerInvoice
from models.vendor_bill import VendorBill
from models.payment import Payment
from models.sales_order import SalesOrder
from models.purchase_order import PurchaseOrder
from models.contact import Contact
from sqlalchemy import func, union_all, select
from datetime import date

def generate_balance_sheet():
    """Generates a Balance Sheet report."""
    total_receivable = db.session.query(func.sum(CustomerInvoice.total_amount)).filter_by(status='Unpaid').scalar()
    total_cash_bank = db.session.query(func.sum(Payment.amount)).scalar()
    total_payable = db.session.query(func.sum(VendorBill.total_amount)).filter_by(status='Unpaid').scalar()
    
    return {
        "assets": {
            "accounts_receivable": float(total_receivable or 0),
            "cash_and_bank": float(total_cash_bank or 0)
        },
        "liabilities": {
            "accounts_payable": float(total_payable or 0)
        }
    }

def generate_profit_and_loss():
    """Generates a Profit & Loss statement."""
    total_sales = db.session.query(func.sum(CustomerInvoice.total_amount)).scalar()
    total_purchases = db.session.query(func.sum(VendorBill.total_amount)).scalar()
    net_profit = (total_sales or 0) - (total_purchases or 0)
    
    return {
        "income": float(total_sales or 0),
        "expenses": float(total_purchases or 0),
        "net_profit": float(net_profit)
    }

def generate_partner_ledger(contact_id):
    """Generates a ledger of all transactions for a specific contact."""
    contact = Contact.query.get(contact_id)
    if not contact:
        return None, "Contact not found"

    all_transactions = []
    
    # Fetch Invoices and their payments
    if contact.type in ['Customer', 'Both']:
        invoices = db.session.query(
            CustomerInvoice.invoice_id.label('ref_id'),
            CustomerInvoice.invoice_date.label('date'),
            CustomerInvoice.total_amount.label('amount'),
            db.literal('Invoice').label('type')
        ).join(SalesOrder).filter(SalesOrder.customer_id == contact_id)
        all_transactions.extend(invoices.all())
        
        invoice_payments = db.session.query(
            Payment.payment_id.label('ref_id'),
            Payment.payment_date.label('date'),
            (Payment.amount * -1).label('amount'),
            db.literal('Payment').label('type')
        ).filter(Payment.related_type == 'Invoice', Payment.related_id.in_([i.invoice_id for i in CustomerInvoice.query.join(SalesOrder).filter(SalesOrder.customer_id == contact_id).all()]))
        all_transactions.extend(invoice_payments.all())
    
    # Fetch Bills and their payments
    if contact.type in ['Vendor', 'Both']:
        bills = db.session.query(
            VendorBill.bill_id.label('ref_id'),
            VendorBill.bill_date.label('date'),
            (VendorBill.total_amount * -1).label('amount'),
            db.literal('Bill').label('type')
        ).join(PurchaseOrder).filter(PurchaseOrder.vendor_id == contact_id)
        all_transactions.extend(bills.all())
        
        bill_payments = db.session.query(
            Payment.payment_id.label('ref_id'),
            Payment.payment_date.label('date'),
            (Payment.amount * 1).label('amount'),
            db.literal('Payment').label('type')
        ).filter(Payment.related_type == 'Bill', Payment.related_id.in_([b.bill_id for b in VendorBill.query.join(PurchaseOrder).filter(PurchaseOrder.vendor_id == contact_id).all()]))
        all_transactions.extend(bill_payments.all())
    
    all_transactions.sort(key=lambda x: x.date)
    
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

    return ledger_entries, None