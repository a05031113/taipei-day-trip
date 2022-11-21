def connection():
    import mysql.connector as connector
    db = connector.connect(
        pool_name="mypool",
        pool_size=5,
        host="127.0.0.1",
        user="root",
        password="Password",
        database="TP"
    )
    return db


def attraction_data(attraction, images):
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
    return attraction_data


def image_url(cursor, id):
    select_image = """
        SELECT GROUP_CONCAT(image_url) FROM images WHERE attraction_id = %s
        """
    cursor.execute(select_image, id)
    images = cursor.fetchall()
    images = images[0][0].split(",")
    return images