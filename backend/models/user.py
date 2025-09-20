from extensions import db

class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum("Admin", "Accountant", "Contact", name="user_role"), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
