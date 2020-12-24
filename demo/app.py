from pathlib import Path
from flask import Flask, render_template, request

from models import db, seed_data, Cart, Product


app = Flask(__name__)

app.config["SECRET_KEY"] = b'_5#y2L"F4Q8z\n\xec]/'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_RECORD_QUERIES"] = False
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
with app.app_context():
    seed_data()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/cart")
def cart():
    return render_template(
        "cart/index.html",
        products=Product.get_all(),
        items=Cart.get_all(),
    )


@app.route("/cart/add")
def cart_add():
    product_id = request.args.get("product_id", type=int)
    return render_template(
        "cart/Cart.html",
        items=Cart.get_all(),
    )
