from extensions import db

class Tax(db.Model):
    __tablename__ = "taxes"

    tax_id = db.Column(db.Integer, primary_key=True)
    tax_name = db.Column(db.String(50), nullable=False)
    computation_method = db.Column(db.Enum("Percentage", "Fixed", name="tax_method"), nullable=False)
    value = db.Column(db.Numeric(10,2), nullable=False)
    applicable_on = db.Column(db.Enum("Sales", "Purchase", "Both", name="tax_applicable"), nullable=False)
