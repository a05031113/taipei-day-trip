# from function import connection

# db = connection()
# cursor = db.cursor()

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

# cursor.execute("SELECT category FROM attractions")
# categories = cursor.fetchall()
# categories_list = []
# for category in categories:
#     if category[0] not in categories_list:
#         categories_list.append(category[0])
# print(categories_list)


print("hello world")
