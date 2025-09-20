from extensions import db
from datetime import date

class VendorBill(db.Model):
    __tablename__ = "vendor_bills"

    bill_id = db.Column(db.Integer, primary_key=True)
    po_id = db.Column(db.Integer, db.ForeignKey("purchase_orders.po_id", ondelete="CASCADE"), nullable=False)
    bill_date = db.Column(db.Date, default=date.today, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    total_amount = db.Column(db.Numeric(12,2), nullable=False)
    status = db.Column(db.String(20), default="Unpaid")

    payments = db.relationship("Payment", backref="bill", cascade="all, delete")

    def __repr__(self):
        return f"<VendorBill {self.bill_id}>"
