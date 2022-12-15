from .db import *


class database:
    def by_keyword(keyword, page):
        db = connection()
        cursor = db.cursor(buffered=True, dictionary=True)
        search = """
            SELECT * FROM attractions 
            WHERE (category = %s OR name LIKE %s)
            LIMIT %s, 13
            """
        search_val = (keyword, "%"+keyword+"%", page*12)
        cursor.execute(search, search_val)
        attractions = cursor.fetchall()
        cursor.close()
        db.close()
        return attractions

    def no_keyword(page):
        db = connection()
        cursor = db.cursor(buffered=True, dictionary=True)
        search = "SELECT * FROM attractions LIMIT %s, 13"
        search_page = (page*12,)
        cursor.execute(search, search_page)
        attractions = cursor.fetchall()
        cursor.close()
        db.close()
        return attractions

    def by_id(id):
        db = connection()
        cursor = db.cursor(buffered=True, dictionary=True)
        check = "SELECT * FROM attractions WHERE id = %s"
        check_id = (id, )
        cursor.execute(check, check_id)
        attraction = cursor.fetchone()
        cursor.close()
        db.close()
        return attraction

    def image_url(id):
        db = connection()
        cursor = db.cursor(buffered=True, dictionary=True)
        select_image = """
            SELECT GROUP_CONCAT(image_url) FROM images WHERE attraction_id = %s
            """
        select_id = (id,)
        cursor.execute(select_image, select_id)
        images = cursor.fetchall()
        images = images[0]["GROUP_CONCAT(image_url)"].split(",")
        if len(images) > 7:
            images.pop()
        cursor.close()
        db.close()
        return images

    def category():
        db = connection()
        cursor = db.cursor()
        cursor.execute("SELECT DISTINCT category FROM attractions")
        categories = cursor.fetchall()
        categories_list = []
        for category in categories:
            categories_list.append(category[0])
        output = {}
        output["data"] = categories_list
        cursor.close()
        db.close()
        return output


class data_output:
    def if_keyword(keyword, page):
        if keyword:
            return database.by_keyword(keyword, page)
        else:
            return database.no_keyword(page)

    def attraction_data(attraction, images):
        attraction_data = {}
        attraction_data["id"] = attraction["id"]
        attraction_data["name"] = attraction["name"]
        attraction_data["category"] = attraction["category"]
        attraction_data["description"] = attraction["description"]
        attraction_data["address"] = attraction["address"]
        attraction_data["transport"] = attraction["transport"]
        attraction_data["mrt"] = attraction["mrt"]
        attraction_data["lat"] = attraction["lat"]
        attraction_data["lng"] = attraction["lng"]
        attraction_data["image"] = images
        return attraction_data

    def output_data(attractions, page):
        output = {}
        data = []
        if len(attractions) > 12:
            output["nextPage"] = page+1
            count = 12
        elif len(attractions) <= 12 and len(attractions) > 0:
            output["nextPage"] = None
            count = len(attractions)
        else:
            output = {"data": [], "nextPage": None}
        for i in range(count):
            id = attractions[i]["id"]
            images = database.image_url(id)
            result = data_output.attraction_data(attractions[i], images)
            data.append(result)
        output["data"] = data
        return output

    def output_data_id(attraction, id):
        if attraction:
            output = {}
            images = database.image_url(id)
            result = data_output.attraction_data(attraction, images)
            output["data"] = result
            return output
        else:
            False
