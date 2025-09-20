from extensions import db
from datetime import date

class StockLedger(db.Model):
    __tablename__ = "stock_ledger"

    entry_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False)
    movement_type = db.Column(db.String(10), nullable=False)  # In / Out
    quantity = db.Column(db.Numeric(10,2), nullable=False)
    reference_type = db.Column(db.String(20), nullable=False)  # PO, SO, Bill, Invoice
    reference_id = db.Column(db.Integer)
    movement_date = db.Column(db.Date, default=date.today, nullable=False)

    def __repr__(self):
        return f"<StockLedger {self.entry_id}>"
