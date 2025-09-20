from flask import Flask
from config import Config
from extensions import db, jwt, cors, mail
from routes.auth import auth_bp
from routes.protected import protected_bp
from routes.product import product_bp
from routes.master import master_bp
from routes.transaction import transactions_bp
# from routes.reports import reports_bp
from routes.tax import tax_bp

from models.user import User
from models.product import Product
from models.tax import Tax

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = "purvanshu1375@gmail.com"  
    app.config["MAIL_PASSWORD"] = "txfz sxhk ravg mcac"      
    app.config["MAIL_DEFAULT_SENDER"] = "purvanshu1375@gmail.com"

    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    mail.init_app(app)
    
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(protected_bp, url_prefix="/api")
    app.register_blueprint(product_bp, url_prefix="/product")
    app.register_blueprint(master_bp, url_prefix="/master")
    app.register_blueprint(transactions_bp, url_prefix="/transactions")
    # app.register_blueprint(reports_bp, url_prefix="/reports")
    app.register_blueprint(tax_bp, url_prefix="/tax")

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)