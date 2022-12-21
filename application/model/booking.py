from .db import *


class database:
    def booking_data(member_id):
        db = connection()
        cursor = db.cursor(buffered=True, dictionary=True)
        booking_select = """
                SELECT booking.id, booking.attraction_id, attractions.name, attractions.address, booking.date, booking.time, booking.price   
                FROM booking 
                INNER JOIN members ON booking.member_id = members.id 
                INNER JOIN attractions ON booking.attraction_id = attractions.id
                WHERE booking.member_id = %s;
                """
        booking_id = (member_id, )
        cursor.execute(booking_select, booking_id)
        booking_data_all = cursor.fetchall()
        cursor.close()
        db.close()
        return booking_data_all

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

    def insert_booking(member_id, attraction_id, date, time, price):
        db = connection()
        cursor = db.cursor()
        insert_booking = """
            INSERT INTO booking
            (member_id, attraction_id, date, time, price)
            VALUE (%s, %s, %s, %s, %s)
            """
        insert_value = (
            member_id, attraction_id, date, time, price)
        cursor.execute(insert_booking, insert_value)
        db.commit()
        cursor.close()
        db.close()
        return True

    def delete_booking(delete_id):
        db = connection()
        cursor = db.cursor()
        delete_booking = """
            DELETE FROM booking WHERE id = %s
            """
        delete_id = (delete_id, )
        cursor.execute(delete_booking, delete_id)
        db.commit()
        cursor.close()
        db.close()
        return True


class data_output:
    def booking_data(booking_data_all):
        output = {}
        data_list = []
        for booking_data in booking_data_all:
            attraction_id = booking_data["attraction_id"]
            attraction_image = database.image_url(attraction_id)
            data = {}
            attraction = {}
            attraction["id"] = attraction_id
            attraction["name"] = booking_data["name"]
            attraction["address"] = booking_data["address"]
            attraction["image"] = attraction_image
            data["attraction"] = attraction
            data["date"] = str(booking_data["date"])
            data["time"] = booking_data["time"]
            data["price"] = booking_data["price"]
            data["id"] = booking_data["id"]
            data_list.append(data)
            output["data"] = data_list
        return output
