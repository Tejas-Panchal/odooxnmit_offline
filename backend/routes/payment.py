from flask import Blueprint, request, jsonify, url_for, redirect
from flask_jwt_extended import jwt_required
from services.payment_gateway import create_payment_link 
from models.vendor_bill import VendorBill
from models.customer_invoice import CustomerInvoice
from models.payment import Payment
from extensions import db
import datetime

payment_bp = Blueprint('payment', __name__)

@payment_bp.route("/initiate-vendor-bill-payment/<int:bill_id>", methods=["POST"])
@jwt_required()
def initiate_vendor_bill_payment(bill_id):
    bill = VendorBill.query.get_or_404(bill_id)
    if bill.status == 'Paid':
        return jsonify({"msg": "This bill has already been paid."}), 400
    try:
        payment_link = create_payment_link(
            amount=bill.total_amount,
            ref_id=bill.bill_id,
            ref_type='Bill',
            description=f"Payment for Vendor Bill {bill.bill_id}"
        )
        return jsonify({"msg": "Payment link generated", "payment_url": payment_link}), 200
    except Exception as e:
        return jsonify({"msg": "Failed to initiate payment", "error": str(e)}), 500

@payment_bp.route("/initiate-customer-invoice-payment/<int:invoice_id>", methods=["POST"])
@jwt_required()
def initiate_customer_invoice_payment(invoice_id):
    invoice = CustomerInvoice.query.get_or_404(invoice_id)
    if invoice.status == 'Paid':
        return jsonify({"msg": "This invoice has already been paid."}), 400
    try:
        payment_link = create_payment_link(
            amount=invoice.total_amount,
            ref_id=invoice.invoice_id,
            ref_type='Invoice',
            description=f"Payment for Customer Invoice {invoice.invoice_id}"
        )
        return jsonify({"msg": "Payment link generated", "payment_url": payment_link}), 200
    except Exception as e:
        return jsonify({"msg": "Failed to initiate payment", "error": str(e)}), 500

@payment_bp.route("/success", methods=["GET"])
def payment_success():
    ref_id = request.args.get('ref_id')
    ref_type = request.args.get('ref_type')

    if not ref_id or not ref_type:
        return jsonify({"msg": "Missing reference ID or type"}), 400

    if ref_type == 'Bill':
        bill = VendorBill.query.filter_by(bill_id=ref_id).first()
        if not bill:
            return jsonify({"msg": "Bill not found"}), 404
        if bill.status == 'Unpaid':
            bill.status = 'Paid'
            new_payment = Payment(related_type='Bill', related_id=ref_id, amount=bill.total_amount, payment_date=datetime.date.today(), method='Online')
            db.session.add(new_payment)
            db.session.commit()
            return jsonify({"msg": "Payment successful and bill updated."}), 200
    
    elif ref_type == 'Invoice':
        invoice = CustomerInvoice.query.filter_by(invoice_id=ref_id).first()
        if not invoice:
            return jsonify({"msg": "Invoice not found"}), 404
        if invoice.status == 'Unpaid':
            invoice.status = 'Paid'
            new_payment = Payment(related_type='Invoice', related_id=ref_id, amount=invoice.total_amount, payment_date=datetime.date.today(), method='Online')
            db.session.add(new_payment)
            db.session.commit()
            return jsonify({"msg": "Payment successful and invoice updated."}), 200

    return jsonify({"msg": "Payment not processed or already paid."}), 200

@payment_bp.route("/cancel", methods=["GET"])
def payment_cancel():
    return jsonify({"msg": "Payment cancelled. No changes have been made."}), 200