from flask import *

api_thankyou = Blueprint("api_thankyou", __name__)


@api_thankyou.route("/thankyou")
def thankyou_route():
    return render_template("thankyou.html")
