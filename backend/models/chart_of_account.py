from extensions import db

class ChartOfAccount(db.Model):
    __tablename__ = "chart_of_accounts"

    account_id = db.Column(db.Integer, primary_key=True)
    account_name = db.Column(db.String(100), nullable=False)
    account_type = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"<Account {self.account_name}>"
