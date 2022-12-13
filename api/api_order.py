from flask import *
from static.function import *

api_order = Blueprint("api_order", __name__)


@api_order.route("/api/orders", methods=["GET", "POST"])
def order_api():
    if request.method == "POST":
        data = request.get_json()
        return jsonify(data)
