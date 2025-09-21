from extensions import db
from models.stock_leadger import StockLedger
from models.product import Product
from sqlalchemy import func, and_
from datetime import date

def record_stock_movement(product_id, quantity, movement_type, reference_type, reference_id):
    """Records a stock movement entry."""
    try:
        new_entry = StockLedger(
            product_id=product_id,
            quantity=quantity,
            movement_type=movement_type,
            reference_type=reference_type,
            reference_id=reference_id,
            movement_date=date.today()
        )
        db.session.add(new_entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise e

def update_stock_on_purchase(product_id, quantity, po_id):
    """Adds stock for a purchased item."""
    record_stock_movement(product_id, quantity, 'In', 'PO', po_id)

def update_stock_on_sale(product_id, quantity, so_id):
    """Subtracts stock for a sold item."""
    record_stock_movement(product_id, quantity, -quantity, 'SO', so_id)
    
def get_current_stock():
    """Generates a real-time stock report."""
    stock_levels = db.session.query(
        Product.product_name,
        func.sum(StockLedger.quantity).label('current_stock')
    ).join(StockLedger).group_by(Product.product_name).all()

    return [{"product_name": name, "current_stock": float(stock)} for name, stock in stock_levels]