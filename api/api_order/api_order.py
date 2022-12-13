from flask import *
from api.db import *

api_order = Blueprint("api_order", __name__)


@api_order.route("/api/orders", methods=["GET"])
def api_order_get():
    return True


@api_order.route("/api/orders", methods=["POST"])
def api_order_post():
    data = request.get_json()
    return jsonify(data)
