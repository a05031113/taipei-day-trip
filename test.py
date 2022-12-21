# from application.model.db import *

# db = connection()
# cursor = db.cursor()

# # check_password = "SELECT password, id FROM members WHERE email = %s"
# # check_value = ("a05031113@gmail.com", )
# # cursor.execute(check_password, check_value)
# # account = cursor.fetchone()
# # # images = images[0][0].split(",")
# # # images = []
# # # for image_url in images:
# # #     print(image_url[0])

# # print(account[1])
# email = "a05031113@@gma.il.com"

# if email_valid(email) == False:
#     print("falsw")
# else:
#     print("true")

import threading


class MyJob(threading.Thread):
    def run(self):
        for i in range(5):
            print(i)


job1 = MyJob()  # 建立執行緒
job1.start()  # 啟動執行緒，執行 run 函式中的程式碼
print("Hello")
job2 = MyJob()
job2.start()
