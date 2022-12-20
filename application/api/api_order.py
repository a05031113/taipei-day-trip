from flask import *
from flask_jwt_extended import *
from application.model.order import *


api_order = Blueprint("api_order", __name__)


@api_order.route("/order")
def order():
    return render_template("order.html")


@api_order.route("/api/orders", methods=["GET"])
@jwt_required()
def api_order_get():
    member_id = get_jwt()["sub"]["user_id"]
    order_information = database.get_order_information(member_id)
    output = data_output.order_data(order_information)
    return jsonify(output)


@api_order.route("/api/orders", methods=["POST"])
@jwt_required()
def api_order_post():
    data = request.get_json()
    prime = data["prime"]
    amount = data["order"]["price"]
    name = data["contact"]["name"]
    email = data["contact"]["email"]
    phone_number = data["contact"]["phone"]
    member_id = get_jwt()["sub"]["user_id"]
    try:
        if not phone_number or not name or not email:
            return jsonify({"error": True, "message": "缺少資訊"})
        output = tap_pay.check_payment(
            prime, amount, name, email, phone_number, data["order"]["trip"], member_id)
        return jsonify(output)
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500
