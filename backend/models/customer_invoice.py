from extensions import db
from datetime import date

class CustomerInvoice(db.Model):
    __tablename__ = "customer_invoices"

    invoice_id = db.Column(db.Integer, primary_key=True)
    so_id = db.Column(db.Integer, db.ForeignKey("sales_orders.so_id", ondelete="CASCADE"), nullable=False)
    invoice_date = db.Column(db.Date, default=date.today, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    total_amount = db.Column(db.Numeric(12,2), nullable=False)
    status = db.Column(db.String(20), default="Unpaid")

    def __repr__(self):
        return f"<CustomerInvoice {self.invoice_id}>"
