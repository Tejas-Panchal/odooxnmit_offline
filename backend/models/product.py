from extensions import db

class Product(db.Model):
    __tablename__ = "products"

    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.Enum("Goods", "Service", name="product_type"), nullable=False)
    sales_price = db.Column(db.Numeric(10,2))
    purchase_price = db.Column(db.Numeric(10,2))
    sales_tax_id = db.Column(db.Integer, db.ForeignKey("taxes.tax_id"))
    purchase_tax_id = db.Column(db.Integer, db.ForeignKey("taxes.tax_id"))
    hsn_code = db.Column(db.String(20))
    category = db.Column(db.String(50))
