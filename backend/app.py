from flask import Flask
from config import Config
from extensions import db, jwt, cors

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)


    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)