from flask import *
from static.function import *
from flask_jwt_extended import *
from datetime import *
api_booking = Blueprint('api_booking', __name__)


@api_booking.route("/api/booking", methods=["GET", "POST", "DELETE"])
@jwt_required()
def booking_api():
    if request.method == "POST":
        data = request.get_json()
        return jsonify(data)
