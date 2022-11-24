import json
import mysql.connector as connector
from Password import test

with open("taipei-attractions.json", newline="") as file:
    data = json.load(file)
    results = data["result"]["results"]

db = connector.connect(
    host="127.0.0.1",
    user="root",
    password=test(),
    database="TP"
)

cursor = db.cursor()

# for result in results:
#     insert = ("""
#         INSERT INTO attractions
#         (id, name, category, description, address, transport, mrt, lat, lng)
#         VALUES
#         (%s, %s, %s, %s, %s, %s, %s, %s, %s)
#         """)
#     insert_val = (result["_id"], result["name"], result["CAT"], result["description"], result["address"],
#                   result["direction"], result["MRT"], result["latitude"], result["longitude"])
#     cursor.execute(insert, insert_val)
#     db.commit()

# for result in results:
#     images = result["file"]
#     images = images.split("https")
#     id = result["_id"]

#     for i in range(1, len(images)):
#         pic = "https"+images[i]
#         insert = ("""
#         INSERT INTO images
#         (attraction_id, image_url)
#         VALUES
#         (%s, %s)
#         """)
#         insert_val = (id, pic)
#         cursor.execute(insert, insert_val)
#         db.commit()

select = ("""
    SELECT attractions.id, name, category, address, transport, mrt, lat, lng
    FROM attractions WHERE name LIKE %s
    """)
select_val = ("%中山%", )
cursor.execute(select, select_val)
ans = cursor.fetchall()
output = {}


cursor.close()
db.close()
