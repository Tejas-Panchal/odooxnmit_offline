from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from models import VendorBill, CustomerInvoice, Payment, StockLedger, Product
from extentions import db

reports_bp = Blueprint('reports', __name__)

@reports_bp.route("/balance-sheet", methods=["GET"])
@jwt_required()
def get_balance_sheet():
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
    stock_levels = db.session.query(
        Product.product_name,
        func.sum(StockLedger.quantity).label('current_stock')
    ).join(StockLedger).group_by(Product.product_name).all()

    result = [{"product_name": name, "current_stock": float(stock)} for name, stock in stock_levels]
    return jsonify(result), 200