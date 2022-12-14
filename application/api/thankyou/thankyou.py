from flask import *

thankyou = Blueprint("thankyou", __name__)


@thankyou.route("/thankyou")
def thankyou_route():
    return render_template("thankyou.html")
