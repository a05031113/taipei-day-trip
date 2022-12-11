from flask import *
from static.function import *
from flask_jwt_extended import *
from datetime import *
api_booking = Blueprint('api_booking', __name__)


@api_booking.route("/api/booking", methods=["GET", "POST", "DELETE"])
@jwt_required()
def booking_api():
    if request.method == "GET":
        db = connection()
        cursor = db.cursor(buffered=True, dictionary=True)
        try:
            output = {}
            data_list = []
            member_id = int(get_jwt()["sub"]["user_id"])
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
            if booking_data_all == None:
                return jsonify({"data": None})
            for booking_data in booking_data_all:
                select_image = """
                    SELECT image_url FROM images WHERE attraction_id = %s
                    """
                select_id = (booking_data["attraction_id"],)
                cursor.execute(select_image, select_id)
                attraction_image = cursor.fetchone()["image_url"]
                data = {}
                attraction = {}
                attraction["id"] = booking_data["attraction_id"]
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
            return jsonify(output), 200
        except:
            return jsonify({"error": True, "message": SyntaxError}), 500
        finally:
            cursor.close()
            db.close()
    elif request.method == "POST":
        db = connection()
        cursor = db.cursor()
        try:
            data = request.get_json()
            member_id = int(get_jwt()["sub"]["user_id"])
            attraction_id = int(data["attractionId"])
            date = data["date"]
            time = data["time"]
            price = data["price"]
            print(member_id, attraction_id,
                  date, time, price)
            if date == None or time == None or price == None:
                return jsonify({"error": True, "message": "缺少日期或時間"}), 400
            insert_booking = """
                INSERT INTO booking
                (member_id, attraction_id, date, time, price)
                VALUE (%s, %s, %s, %s, %s)
                """
            insert_value = (
                member_id, attraction_id, date, time, price)
            cursor.execute(insert_booking, insert_value)
            db.commit()
            return jsonify({"ok": True}), 200
        except TypeError:
            return jsonify({"error": True, "message": "缺少資料或資料格式不符"}), 400
        except:
            return jsonify({"error": True, "message": SyntaxError}), 500
        finally:
            cursor.close()
            db.close()
    elif request.method == "DELETE":
        db = connection()
        cursor = db.cursor()
        try:
            data = request.get_json()
            delete_id = data["deleteId"]
            delete_booking = """
                DELETE FROM booking WHERE id = %s
                """
            delete_id = (delete_id, )
            cursor.execute(delete_booking, delete_id)
            db.commit()
            return jsonify({"ok": True})
        except:
            return jsonify({"error": True, "message": SyntaxError}), 500
        finally:
            cursor.close()
            db.close()
