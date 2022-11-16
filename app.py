from flask import *
from function import connection
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Pages


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


@app.route("/api/attractions")
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
            page = 0
        # if keyword
        if keyword:
            search = """
                SELECT * FROM attractions 
                WHERE (category = %s OR name LIKE %s)
                LIMIT %s, 12
                """
            search_val = (keyword, "%"+keyword+"%", page*12)
            cursor.execute(search, search_val)
            attractions = cursor.fetchall()
        else:
            search = "SELECT * FROM attractions LIMIT %s, 12"
            search_page = (page*12,)
            cursor.execute(search, search_page)
            attractions = cursor.fetchall()
        # set output dic and data list
        output = {}
        data = []
        # if having next page
        for attraction in attractions:
            id = (attraction[0], )
            select_image = """
                SELECT image_url FROM images WHERE attraction_id = %s
                """
            cursor.execute(select_image, id)
            images_url = cursor.fetchall()
            images = []
            for image_url in images_url:
                images.append(image_url[0])
            attraction_data = {}
            attraction_data["id"] = attraction[0]
            attraction_data["name"] = attraction[1]
            attraction_data["category"] = attraction[2]
            attraction_data["description"] = attraction[3]
            attraction_data["address"] = attraction[4]
            attraction_data["transport"] = attraction[5]
            attraction_data["mrt"] = attraction[6]
            attraction_data["lat"] = attraction[7]
            attraction_data["lng"] = attraction[8]
            attraction_data["image"] = images
            data.append(attraction_data)
        output["data"] = data
        if len(attractions) == 12:
            output["nextPage"] = page+1
        elif len(attractions) < 12 and len(attractions) > 0:
            output["nextPage"] = None
        else:
            output = {"data": [], "nextPage": None}
        return jsonify(output)
    except:
        return jsonify({"error": True, "message": "Something wrong"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()


@app.route("/api/attractions/<id>")
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
            select_image = """
                SELECT image_url FROM images WHERE attraction_id = %s
                """
            cursor.execute(select_image, id)
            images_url = cursor.fetchall()
            images = []
            for image in images_url:
                images.append(image[0])
            # write in to dic
            output = {}
            data = {}
            data["id"] = attraction[0]
            data["name"] = attraction[1]
            data["category"] = attraction[2]
            data["description"] = attraction[3]
            data["address"] = attraction[4]
            data["transport"] = attraction[5]
            data["mrt"] = attraction[6]
            data["lat"] = attraction[7]
            data["lng"] = attraction[8]
            data["image"] = images
            output["data"] = data
            return jsonify(output)
        else:
            return jsonify({"error": True, "message": "No id"}), 400
    except:
        return jsonify({"error": True, "message": "Something wrong"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()


@app.route("/api/categories")
def api_categories():
    db = connection()
    cursor = db.cursor()
    try:
        output = {}
        cursor.execute("SELECT category FROM attractions")
        categories = cursor.fetchall()
        categories_list = []
        for category in categories:
            if category[0] not in categories_list:
                categories_list.append(category[0])
        output["data"] = categories_list
        return jsonify(output)
    except:
        return jsonify({"error": True, "message": "Something wrong"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()


app.run(host="0.0.0.0", port=3000, debug=True)
