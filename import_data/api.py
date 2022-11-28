from flask import *
from import_data.function import *
api = Blueprint('api', __name__)


@api.route("/api/attractions")
def api_attractions():
    page = request.args.get("page")
    keyword = request.args.get("keyword")
    db = connection()
    cursor = db.cursor()
    output = {}
    data = []
    try:
        # If page
        if page:
            page = int(page)
        else:
            return jsonify({"error": True, "message": "no page"}), 500
        # if keyword
        if keyword:
            search = """
                SELECT * FROM attractions 
                WHERE (category = %s OR name LIKE %s)
                LIMIT %s, 13
                """
            search_val = (keyword, "%"+keyword+"%", page*12)
            cursor.execute(search, search_val)
            attractions = cursor.fetchall()
            if len(attractions) == 0:
                return jsonify({"nextPage": None, "data": None})
        else:
            search = "SELECT * FROM attractions LIMIT %s, 13"
            search_page = (page*12,)
            cursor.execute(search, search_page)
            attractions = cursor.fetchall()
        # set output dic and data list
        output = {}
        data = []
        # check next page exist
        if len(attractions) > 12:
            output["nextPage"] = page+1
            count = 12
        elif len(attractions) <= 12 and len(attractions) > 0:
            output["nextPage"] = None
            count = len(attractions)
        else:
            output = {"data": [], "nextPage": None}
        # put data into output
        for i in range(count):
            id = (attractions[i][0], )
            images = image_url(cursor, id)
            result = attraction_data(attractions[i], images)
            data.append(result)
        output["data"] = data
        return jsonify(output)
    except:
        return jsonify({"error": True, "message": "Something wrong"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()


@api.route("/api/attractions/<id>")
def api_attractions_id(id):
    try:
        db = connection()
        cursor = db.cursor()
        check = "SELECT * FROM attractions WHERE id = %s"
        id = (id, )
        cursor.execute(check, id)
        is_id = cursor.fetchone()
        if is_id:
            # select attraction
            select_attraction = """
                SELECT * FROM attractions WHERE id = %s
                """
            cursor.execute(select_attraction, id)
            attraction = cursor.fetchone()
            # select image
            images = image_url(cursor, id)
            # write in to dic
            output = {}
            result = attraction_data(attraction, images)
            output["data"] = result
            return jsonify(output)
        else:
            return jsonify({"error": True, "message": "No id"}), 400
    except:
        return jsonify({"error": True, "message": "Something wrong"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()


@api.route("/api/categories")
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
        return jsonify({"error": True, "message": "Something wrong"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()
