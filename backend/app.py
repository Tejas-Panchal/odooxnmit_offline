from flask import Flask
from config import Config
from extensions import db, jwt, cors
from routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    
    app.register_blueprint(auth_bp, url_prefix="/auth")
    # app.register_blueprint(protected_bp, url_prefix="/api")


    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)