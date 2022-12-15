import os
from flask import Flask
from dotenv import load_dotenv
from .api import *
from .model.users import jwt
load_dotenv()


def create_app():
    app = Flask(__name__)
    jwt.init_app(app)

    with app.app_context():
        app.config["JSON_AS_ASCII"] = False
        app.config["TEMPLATES_AUTO_RELOAD"] = True
        app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
        app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
        app.config["JWT_COOKIE_SECURE"] = False
        app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=6)
        app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

        jwt.init_app(app)

        app.register_blueprint(api_attractions)
        app.register_blueprint(api_users)
        app.register_blueprint(api_booking)
        app.register_blueprint(api_order)
        app.register_blueprint(api_index)
        app.register_blueprint(api_thankyou)

    return app
