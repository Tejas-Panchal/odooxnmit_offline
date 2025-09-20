from extensions import db
from sqlalchemy.dialects.postgresql import ENUM

class Contact(db.Model):
    __tablename__ = "contacts"

    contact_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.Enum("Customer", "Vendor", "Both", name="contact_type"), nullable=False)
    email = db.Column(db.String(100))
    mobile = db.Column(db.String(15))
    address = db.Column(db.String(255))
    city = db.Column(db.String(50), nullable=True)
    state = db.Column(db.String(50), nullable=True)
    pincode = db.Column(db.String(10), nullable=True)
    profile_image = db.Column(db.String(255), nullable=True)

    # Corrected line
    created_by = db.Column(db.String(20), db.ForeignKey("users.user_id", ondelete="SET NULL"))