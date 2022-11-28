from import_data.function import connection

db = connection()
cursor = db.cursor()

select_image = """
    SELECT GROUP_CONCAT(image_url) FROM images WHERE attraction_id = %s
    """
id = (11, )
cursor.execute(select_image, id)
images = cursor.fetchall()
# images = images[0][0].split(",")
# images = []
# for image_url in images:
#     print(image_url[0])

print(images)
