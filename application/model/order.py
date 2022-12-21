import os
import random
from datetime import *
from dotenv import load_dotenv
from application.model.booking import *
from .db import *
import requests
load_dotenv()


class database:
    def check_order(order_number):
        db = connection()
        cursor = db.cursor()
        select_number = """
            SELECT id FROM orders WHERE id = %s
            """
        select_id = (order_number, )
        cursor.execute(select_number, select_id)
        order_existed = cursor.fetchone()
        cursor.close()
        db.close()
        return order_existed

    def insert_order(id, member_id, price, name, email, phone, payment):
        db = connection()
        cursor = db.cursor()
        insert_order = """
            INSERT INTO orders
            (id, member_id, price, name, email, phone, payment)
            VALUE (%s, %s, %s, %s, %s, %s, %s)
            """
        insert_value = (
            id, member_id, price, name, email, phone, payment)
        cursor.execute(insert_order, insert_value)
        db.commit()
        cursor.close()
        db.close()
        return True

    def insert_order_attraction(order_number, attraction_id, date, time):
        db = connection()
        cursor = db.cursor()
        insert_order = """
            INSERT INTO order_attraction
            (order_number, attraction_id, date, time)
            VALUE (%s, %s, %s, %s)
            """
        insert_value = (
            order_number, attraction_id, date, time)
        cursor.execute(insert_order, insert_value)
        db.commit()
        cursor.close()
        db.close()
        return True

    def delete_booking_by_id(member_id):
        db = connection()
        cursor = db.cursor()
        delete_booking = """
            DELETE FROM booking WHERE member_id = %s
            """
        delete_id = (member_id, )
        cursor.execute(delete_booking, delete_id)
        db.commit()
        cursor.close()
        db.close()
        return True

    def get_order_information(member_id):
        db = connection()
        cursor = db.cursor(buffered=True, dictionary=True)
        select_number = """
            SELECT orders.id, price, orders.name, email, phone, payment, attraction_id, date, time, attractions.name as attraction_name, address FROM orders 
            INNER JOIN order_attraction ON orders.id = order_attraction.order_number 
            INNER JOIN attractions ON order_attraction.attraction_id = attractions.id
            WHERE member_id = %s;
            """
        select_id = (member_id, )
        cursor.execute(select_number, select_id)
        order_information = cursor.fetchall()
        cursor.close()
        db.close()
        return order_information

    def get_order_information_by_number(orderNumber):
        db = connection()
        cursor = db.cursor(buffered=True, dictionary=True)
        select_number = """
            SELECT orders.id, price, orders.name, email, phone, payment, attraction_id, date, time, attractions.name as attraction_name, address FROM orders 
            INNER JOIN order_attraction ON orders.id = order_attraction.order_number 
            INNER JOIN attractions ON order_attraction.attraction_id = attractions.id
            WHERE orders.id = %s;
            """
        select_id = (orderNumber, )
        cursor.execute(select_number, select_id)
        order_information = cursor.fetchall()
        cursor.close()
        db.close()
        return order_information

    def image_url(attraction_id):
        db = connection()
        cursor = db.cursor(buffered=True, dictionary=True)
        select_image = """
            SELECT image_url FROM images WHERE attraction_id = %s
            """
        select_id = (attraction_id,)
        cursor.execute(select_image, select_id)
        attraction_image = cursor.fetchone()["image_url"]
        cursor.close()
        db.close()
        return attraction_image


class tap_pay:
    def check_payment(prime, amount, name, email, phone_number, trips, member_id):
        headers = {
            "content-type": "application/json",
            "x-api-key": os.getenv("PARTNER_KEY")
        }
        output_payment = {
            "prime": prime,
            "partner_key": os.getenv("PARTNER_KEY"),
            "merchant_id": "a05031113_TAISHIN",
            "details": "test",
            "amount": amount,
            "cardholder": {
                "name": name,
                "email": email,
                "phone_number": phone_number
            }
        }
        response = requests.post(
            "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime", headers=headers, json=output_payment).json()
        status_code = response["status"]
        now = datetime.now()
        time_string = now.strftime("%Y%m%d%H%M%S")
        check = False
        while check == False:
            order_number = time_string + str(random.randint(1000, 9999))
            check_order = database.check_order(order_number)
            if not check_order:
                check = True
        if status_code == 0:
            payment = True
            database.insert_order(order_number, member_id, amount,
                                  name, email, phone_number, payment)
            for trip in trips:
                database.insert_order_attraction(
                    order_number, trip["attraction"]["id"], trip["date"], trip["time"])
            database.delete_booking_by_id(member_id)
            return {
                "data": {
                    "number": order_number,
                    "payment": {
                        "status": 0,
                        "message": "付款成功"
                    }
                }
            }
        else:
            return {"error": True, "message": "付款錯誤"}


class data_output:
    def order_data(order_information):
        output = {}
        data = []
        for information in order_information:
            check = False
            order = {}
            for i in data:
                if information["id"] == i["number"]:
                    check = True
                    trip = data_output.trip(information)
                    i["trip"].append(trip)
                    break
            if not check:
                order["number"] = information["id"]
                order["price"] = information["price"]
                order["status"] = information["payment"]
                contact = {}
                contact["name"] = information["name"]
                contact["email"] = information["email"]
                contact["phone"] = information["phone"]
                order["contact"] = contact
                trip = [data_output.trip(information)]
                order["trip"] = trip
                data.append(order)
        output["data"] = data
        return output

    def order_data_by_number(order_information):
        output = {}
        trip = []
        for information in order_information:
            order = {}
            order["number"] = information["id"]
            order["price"] = information["price"]
            order["status"] = information["payment"]
            contact = {}
            contact["name"] = information["name"]
            contact["email"] = information["email"]
            contact["phone"] = information["phone"]
            order["contact"] = contact
            trip.append(data_output.trip(information))
        order["trip"] = trip
        output["data"] = order
        return output

    def trip(information):
        return {
            "attraction": {
                "id": information["attraction_id"],
                "name": information["attraction_name"],
                "address": information["address"],
                "image": database.image_url(information["attraction_id"])
            },
            "date": information["date"],
            "time": information["time"]
        }
