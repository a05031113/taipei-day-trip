from flask import *
from static.py.function import *
api_cat = Blueprint('api_cat', __name__)


@api_cat.route("/api/categories")
def api_categories():
    db = connection()
    cursor = db.cursor()
    try:
        output = {}
        cursor.execute("SELECT DISTINCT category FROM attractions")
        categories = cursor.fetchall()
        categories_list = []
        for category in categories:
            categories_list.append(category[0])
        output["data"] = categories_list
        return jsonify(output)
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()
