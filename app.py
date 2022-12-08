import os
from dotenv import load_dotenv
from flask import *
from static.function import *
from static.api.api_attractions import *
from static.api.api_users import *
from static.api.api_booking import *
from flask_jwt_extended import *
load_dotenv()
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=6)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

jwt = JWTManager(app)


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"error": True, "message": "Not login yet"}), 403


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


app.register_blueprint(api_attr)
app.register_blueprint(api_users)
app.register_blueprint(api_booking)
app.run(host="0.0.0.0", port=3000, debug=True)
