from extensions import db
from datetime import date

class SalesOrder(db.Model):
    __tablename__ = "sales_orders"

    so_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("contacts.contact_id", ondelete="CASCADE"), nullable=False)
    order_date = db.Column(db.Date, default=date.today, nullable=False)
    status = db.Column(db.String(20), default="Draft")
    created_by = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

    items = db.relationship("SalesOrderItem", backref="sales_order", cascade="all, delete")
    invoices = db.relationship("CustomerInvoice", backref="sales_order", cascade="all, delete")

    def __repr__(self):
        return f"<SalesOrder {self.so_id}>"
