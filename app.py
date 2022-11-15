from flask import *
import mysql.connector as connector
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
        # If keyword
        if keyword:
            search = """
                SELECT * FROM attractions 
                WHERE (category = %s OR name LIKE %s)
                """
            search_val = (keyword, "%"+keyword+"%")
            cursor.execute(search, search_val)
            attraction = cursor.fetchall()
        else:
            cursor.execute("SELECT * FROM attractions")
            attraction = cursor.fetchall()
        # If page
        if page:
            page = int(page)
        else:
            page = 0
        # set output dic and data list
        output = {}
        data = []
        # if having next page
        if len(attraction) > page*12+12:
            output["nextPage"] = page+1
            for i in range(page*12, page*12+12):
                id = (attraction[i][0], )
                select_image = """
                    SELECT image_url FROM images WHERE attraction_id = %s
                    """
                cursor.execute(select_image, id)
                images_url = cursor.fetchall()
                images = []
                for image_url in images_url:
                    images.append(image_url[0])
                attraction_data = {}
                attraction_data["id"] = attraction[i][0]
                attraction_data["name"] = attraction[i][1]
                attraction_data["category"] = attraction[i][2]
                attraction_data["description"] = attraction[i][3]
                attraction_data["address"] = attraction[i][4]
                attraction_data["transport"] = attraction[i][5]
                attraction_data["mrt"] = attraction[i][6]
                attraction_data["lat"] = attraction[i][7]
                attraction_data["lng"] = attraction[i][8]
                attraction_data["image"] = images
                data.append(attraction_data)
            output["data"] = data
            return jsonify(output)
        # if no having next page
        elif len(attraction) > page*12:
            output["nextPage"] = None
            for i in range(page*12, len(attraction)):
                id = (attraction[i][0],)
                select_image = """
                    SELECT image_url FROM images WHERE attraction_id = %s
                    """
                cursor.execute(select_image, id)
                images_url = cursor.fetchall()
                images = []
                for image_url in images_url:
                    images.append(image_url[0])
                attraction_data = {}
                attraction_data["id"] = attraction[i][0]
                attraction_data["name"] = attraction[i][1]
                attraction_data["category"] = attraction[i][2]
                attraction_data["description"] = attraction[i][3]
                attraction_data["address"] = attraction[i][4]
                attraction_data["transport"] = attraction[i][5]
                attraction_data["mrt"] = attraction[i][6]
                attraction_data["lat"] = attraction[i][7]
                attraction_data["lng"] = attraction[i][8]
                attraction_data["image"] = images
                data.append(attraction_data)
            output["data"] = data
            return jsonify(output)
        # nothing
        else:
            return jsonify({"data": [], "nextPage": None})
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


app.run(port=3000, debug=True)
