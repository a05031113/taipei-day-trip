from flask import *
from static.py.function import *
from flask_jwt_extended import *
from werkzeug.security import *
from datetime import *
api_users = Blueprint('api_users', __name__)


@api_users.route("/refresh", methods=["GET"])
@jwt_required(refresh=True)
def refresh():
    response = jsonify({"refresh": True})
    identity = get_jwt_identity()
    access_token = create_access_token(
        identity=identity, fresh=timedelta(minutes=5))
    set_access_cookies(response, access_token)
    return response, 200


@api_users.route("/api/user", methods=["POST"])
def api_user():
    try:
        data = request.get_json()["data"]
        name = data["name"]
        email = data["email"]
        password = data["password"]
        if email_valid(email) == False:
            print("email")
            return jsonify({"error": True, "message": "wrong format"})
        if password_valid(password) == False:
            print("password")
            return jsonify({"error": True, "message": "wrong format"})
        db = connection()
        cursor = db.cursor()
        check_is_used = "SELECT email FROM members WHERE email = %s"
        check_value = (email, )
        cursor.execute(check_is_used, check_value)
        is_used = cursor.fetchone()
        if is_used:
            return jsonify({"error": True, "message": "Email was already used"}), 400
        else:
            insert_member = """
                INSERT INTO members
                (name, email, password)
                VALUE (%s, %s, %s)
                """
            insert_value = (name, email, generate_password_hash(password))
            cursor.execute(insert_member, insert_value)
            db.commit()
        return jsonify({"ok": True}), 200
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()


@api_users.route("/test")
@jwt_required()
def test():
    data = get_jwt()
    return jsonify(data["sub"]), 200


@api_users.route("/api/user/auth", methods=["GET", "PUT", "DELETE"])
def api_user_auth():
    if request.method == "GET":
        verify_jwt_in_request()
        data = get_jwt()
        return jsonify(data["sub"]), 200
    elif request.method == "PUT":
        try:
            data = request.get_json()
            email = data["email"]
            password = data["password"]
            db = connection()
            cursor = db.cursor()
            check_password = "SELECT password, id, name, email FROM members WHERE email = %s"
            check_value = (email, )
            cursor.execute(check_password, check_value)
            account = cursor.fetchone()
            if account and check_password_hash(account[0], password):
                identity = {"user_id": str(
                    account[1]), "name": account[2], "email": account[3]}
                response = jsonify({"login": True})
                access_token = create_access_token(identity=identity)
                refresh_token = create_refresh_token(identity=identity)
                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)
                return response, 200
            else:
                return jsonify({"error": True, "message": "Wrong email or password"}), 400
        except:
            return jsonify({"error": True, "message": SyntaxError}), 500
        finally:
            if db.is_connected():
                cursor.close()
                db.close()
    elif request.method == "DELETE":
        response = jsonify({"ok": True})
        unset_jwt_cookies(response)
        return response, 200
