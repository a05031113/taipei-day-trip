from flask import *
from flask_jwt_extended import *
from application.model.booking import *
api_booking = Blueprint('api_booking', __name__)


@api_booking.route("/booking")
def booking():
    return render_template("booking.html")


@api_booking.route("/api/booking", methods=["GET"])
@jwt_required()
def api_booking_get():
    try:
        member_id = int(get_jwt()["sub"]["user_id"])
        booking_data_all = database.booking_data(member_id)
        if booking_data_all == None:
            return jsonify({"data": None})
        output = data_output.booking_data(booking_data_all)
        return jsonify(output), 200
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500


@api_booking.route("/api/booking", methods=["POST"])
@jwt_required()
def api_booking_post():
    try:
        data = request.get_json()
        member_id = int(get_jwt()["sub"]["user_id"])
        attraction_id = int(data["attractionId"])
        date = data["date"]
        time = data["time"]
        price = data["price"]
        if date == None or time == None or price == None:
            return jsonify({"error": True, "message": "缺少日期或時間"}), 400
        database.insert_booking(
            member_id, attraction_id, date, time, price)
        return jsonify({"ok": True}), 200
    except TypeError:
        return jsonify({"error": True, "message": "缺少資料或資料格式不符"}), 400
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500


@api_booking.route("/api/booking", methods=["DELETE"])
@jwt_required()
def api_booking_delete():
    try:
        data = request.get_json()
        delete_id = data["deleteId"]
        database.delete_booking(delete_id)
        return jsonify({"ok": True})
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500
