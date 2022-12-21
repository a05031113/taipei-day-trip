from flask import *

api_index = Blueprint("api_index", __name__)


@api_index.route("/")
def index():
    return render_template("index.html")
