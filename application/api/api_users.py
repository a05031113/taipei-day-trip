from flask import *
from flask_jwt_extended import *
from application.model.users import *
api_users = Blueprint('api_users', __name__)


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"error": True, "message": "Not login yet"}), 403


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    try:
        if_used = database.check_revoked(jwt_payload)
        if if_used:
            return True
        return False
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500


@api_users.route("/refresh", methods=["GET"])
@jwt_required(refresh=True)
def refresh():
    try:
        response = token.refresh()
        return response, 200
    except:
        return jsonify({"error": True, "message": SyntaxError})


@api_users.route("/api/user", methods=["POST"])
def api_user():
    try:
        data = request.get_json()["data"]
        name = data["name"]
        email = data["email"]
        password = data["password"]
        if validation.email_valid(email) == False:
            return jsonify({"error": True, "message": "email格式錯誤"})
        if validation.password_valid(password) == False:
            return jsonify({"error": True, "message": "密碼至少需8位英文大小寫與數字"})
        is_used = database.check_user_exist(email)
        if is_used:
            return jsonify({"error": True, "message": "此email已被使用"}), 400
        else:
            database.register(name, email, password)
        return jsonify({"ok": True}), 200
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500


@api_users.route("/api/user/auth", methods=["GET"])
@jwt_required()
def api_user_auth_get():
    try:
        data = get_jwt()
        return jsonify(data["sub"]), 200
    except:
        return jsonify({"error": True, "message": SyntaxError})


@api_users.route("/api/user/auth", methods=["PUT"])
def api_user_auth_put():
    try:
        data = request.get_json()
        email = data["email"]
        password = data["password"]
        account = database.login(email)
        response = token.refresh_token(account, password)
        if response != False:
            return response, 200
        else:
            return jsonify({"error": True, "message": "帳號或密碼有誤"}), 400
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500


@api_users.route("/api/user/auth", methods=["DELETE"])
def api_user_auth_delete():
    try:
        refresh_token = request.cookies.get("refresh_token_cookie")
        response = token.logout(refresh_token)
        return response, 200
    except:
        return jsonify({"error": True, "message": SyntaxError})
