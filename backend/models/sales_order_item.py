from extensions import db

class SalesOrderItem(db.Model):
    __tablename__ = "sales_order_items"

    so_item_id = db.Column(db.Integer, primary_key=True)
    so_id = db.Column(db.Integer, db.ForeignKey("sales_orders.so_id", ondelete="CASCADE"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False)
    quantity = db.Column(db.Numeric(10,2), nullable=False)
    unit_price = db.Column(db.Numeric(10,2), nullable=False)
    tax_id = db.Column(db.Integer, db.ForeignKey("taxes.tax_id"))

    def __repr__(self):
        return f"<SalesOrderItem {self.so_item_id}>"
