import os
from dotenv import load_dotenv
from flask import *
from api import *
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
app.register_blueprint(api_attractions)
app.register_blueprint(api_users)
app.register_blueprint(api_booking)
app.register_blueprint(api_order)

jwt = JWTManager(app)


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"error": True, "message": "Not login yet"}), 403


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    db = connection()
    cursor = db.cursor()
    try:
        cursor.execute(
            "SELECT * FROM revoke_tokens "
            "WHERE jti = %s AND type = %s",
            (jwt_payload["jti"], "refresh")
        )
        row = cursor.fetchone()
        if row:
            return True
        return False
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500
    finally:
        cursor.close()
        db.close()


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


app.run(host="0.0.0.0", port=3000, debug=True)
