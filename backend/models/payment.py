from extensions import db
from datetime import date

class Payment(db.Model):
    __tablename__ = "payments"

    payment_id = db.Column(db.Integer, primary_key=True)
    related_type = db.Column(db.String(20), nullable=False)  # 'Bill' or 'Invoice'
    related_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Numeric(12,2), nullable=False)
    payment_date = db.Column(db.Date, default=date.today, nullable=False)
    method = db.Column(db.String(20), nullable=False)

    bill_id = db.Column(db.Integer, db.ForeignKey("vendor_bills.bill_id", ondelete="CASCADE"), nullable=True)

    def __repr__(self):
        return f"<Payment {self.payment_id}>"
