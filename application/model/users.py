from .db import *
from werkzeug.security import *
from flask_jwt_extended import *
from flask import *
from datetime import *
import re
jwt = JWTManager()


class database:
    def check_user_exist(email):
        db = connection()
        cursor = db.cursor()
        check_is_used = "SELECT email FROM members WHERE email = %s"
        check_value = (email, )
        cursor.execute(check_is_used, check_value)
        is_used = cursor.fetchone()
        cursor.close()
        db.close()
        return is_used

    def register(name, email, password):
        db = connection()
        cursor = db.cursor()
        insert_member = """
            INSERT INTO members
            (name, email, password)
            VALUE (%s, %s, %s)
            """
        insert_value = (name, email, generate_password_hash(password))
        cursor.execute(insert_member, insert_value)
        db.commit()
        cursor.close()
        db.close()
        return True

    def login(email):
        db = connection()
        cursor = db.cursor()
        check_password = "SELECT password, id, name, email FROM members WHERE email = %s"
        check_value = (email, )
        cursor.execute(check_password, check_value)
        account = cursor.fetchone()
        cursor.close()
        db.close()
        return account

    def revoke(jti):
        db = connection()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO revoke_tokens (jti, type, created_at) "
            "VALUES (%s, %s, NOW())",
            (jti, "refresh")
        )
        db.commit()
        cursor.close()
        db.close()
        return True

    def check_revoked(jwt_payload):
        db = connection()
        cursor = db.cursor()
        cursor.execute(
            "SELECT * FROM revoke_tokens "
            "WHERE jti = %s AND type = %s",
            (jwt_payload["jti"], "refresh")
        )
        row = cursor.fetchone()
        cursor.close()
        db.close()
        return row


class validation:
    def email_valid(email):
        email_regex = re.compile(
            r'^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$')
        if re.fullmatch(email_regex, email):
            return True
        else:
            return False

    def password_valid(password):
        password_regex = re.compile(
            r'^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$')
        if re.fullmatch(password_regex, password):
            return True
        else:
            return False


class token:
    def refresh_token(account, password):
        if account and check_password_hash(account[0], password):
            identity = {"user_id": str(
                account[1]), "name": account[2], "email": account[3]}
            response = jsonify({"login": True})
            refresh_token = create_refresh_token(identity=identity)
            set_refresh_cookies(response, refresh_token)
            return response
        else:
            return False

    def logout(refresh_token):
        jti = get_jti(refresh_token)
        database.revoke(jti)
        response = jsonify({"ok": True})
        unset_jwt_cookies(response)
        return response

    def refresh():
        response = jsonify({"refresh": True})
        identity = get_jwt_identity()
        access_token = create_access_token(
            identity=identity, fresh=timedelta(minutes=6))
        set_access_cookies(response, access_token)
        return response
