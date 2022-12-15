from flask import *
from application.model.attraction import *
api_attractions = Blueprint('api_attractions', __name__)


@api_attractions.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@api_attractions.route("/api/attractions")
def api_attractions_get():
    page = request.args.get("page")
    keyword = request.args.get("keyword")
    try:
        if page:
            page = int(page)
        else:
            return jsonify({"error": True, "message": "no page"}), 500
        attractions = data_output.if_keyword(keyword, page)
        if len(attractions) == 0:
            return jsonify({"nextPage": None, "data": None})
        output = data_output.output_data(attractions, page)
        return jsonify(output)
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500


@api_attractions.route("/api/attractions/<id>")
def api_attractions_id_get(id):
    try:
        attraction = database.by_id(id)
        output = data_output.output_data_id(attraction, id)
        if output == False:
            return jsonify({"error": True, "message": "No id"}), 400
        else:
            return jsonify(output)
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500


@api_attractions.route("/api/categories")
def api_categories_get():
    try:
        output = database.category()
        return jsonify(output)
    except:
        return jsonify({"error": True, "message": SyntaxError}), 500
