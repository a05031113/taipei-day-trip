from import_data.function import connection

db = connection()
cursor = db.cursor()

# search = """
#     SELECT * FROM attractions
#     WHERE (category = %s OR name LIKE %s)
#     """
# search_val = ("台北", "%台北%")
# cursor.execute(search, search_val)
# attraction = cursor.fetchall()
# print(len(attraction))
# for row in attraction:
#     id = (row[0],)
#     select_image = """
#         SELECT image_url FROM images WHERE attraction_id = %s
#         """
#     cursor.execute(select_image, id)
#     images_url = cursor.fetchall()
#     images = []
#     for image_url in images_url:
#         images.append(image_url[0])
#     attraction_data = {}
#     attraction_data["id"] = row[0]
#     attraction_data["name"] = row[1]
#     attraction_data["category"] = row[2]
#     # attraction_data["description"] = attraction[3]
#     # attraction_data["address"] = attraction[4]
#     # attraction_data["transport"] = attraction[5]
#     # attraction_data["mrt"] = attraction[6]
#     # attraction_data["lat"] = attraction[7]
#     # attraction_data["lng"] = attraction[8]
#     attraction_data["image"] = images
#     print(attraction_data)
# keyword = "養生溫泉"
# search = """
#     SELECT name FROM attractions
#     WHERE (category = %s OR name LIKE %s)
#     LIMIT 1, 12
#     """
# search_val = (keyword, "%"+keyword+"%")
# cursor.execute(search, search_val)
# categories = cursor.fetchall()
# print(categories)
# print(len(categories))
# page = 1
# if page > 0:
#     page = int(page)

# else:
#     page = 0

# keyword = None
# if keyword:
#     search = """
#         SELECT id FROM attractions
#         WHERE (category = %s OR name LIKE %s)
#         LIMIT %s, 12
#         """
#     search_val = (keyword, "%"+keyword+"%", page*12)
#     cursor.execute(search, search_val)
#     attraction = cursor.fetchall()
# else:
#     search = "SELECT id FROM attractions LIMIT %s, 12"
#     search_page = (page*12,)
#     cursor.execute(search, search_page)
#     attractions = cursor.fetchall()
select_image = """
    SELECT GROUP_CONCAT(image_url) FROM images WHERE attraction_id = %s
    """
id = (2, )
cursor.execute(select_image, id)
images = cursor.fetchall()
# images = []
# for image_url in images:
#     print(image_url[0])

print(images[0][0])
