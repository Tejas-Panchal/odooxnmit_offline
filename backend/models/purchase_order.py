from extensions import db
from datetime import date

class PurchaseOrder(db.Model):
    __tablename__ = "purchase_orders"

    po_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey("contacts.contact_id", ondelete="CASCADE"), nullable=False)
    order_date = db.Column(db.Date, default=date.today, nullable=False)
    status = db.Column(db.String(20), default="Draft")
    created_by = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

    items = db.relationship("PurchaseOrderItem", backref="purchase_order", cascade="all, delete")
    vendor_bills = db.relationship("VendorBill", backref="purchase_order", cascade="all, delete")

    def __repr__(self):
        return f"<PurchaseOrder {self.po_id}>"
