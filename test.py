from static.function import *

db = connection()
cursor = db.cursor()

# check_password = "SELECT password, id FROM members WHERE email = %s"
# check_value = ("a05031113@gmail.com", )
# cursor.execute(check_password, check_value)
# account = cursor.fetchone()
# # images = images[0][0].split(",")
# # images = []
# # for image_url in images:
# #     print(image_url[0])

# print(account[1])
email = "a05031113@@gma.il.com"

if email_valid(email) == False:
    print("falsw")
else:
    print("true")
