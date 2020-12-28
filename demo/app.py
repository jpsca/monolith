from pathlib import Path
from flask import Flask, render_template, request

from models import db, seed_data, Cart, Product
from turbo import render_update, turbo_stream


app = Flask(__name__)

app.debug = True
app.config["RELOADER"] = True
app.config["SECRET_KEY"] = b'_5#y2L"F4Q8z\n\xec]/'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_RECORD_QUERIES"] = False
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.jinja_env.globals["stream"] = turbo_stream
app.jinja_env.filters["stream"] = turbo_stream

db.init_app(app)
with app.app_context():
    seed_data()


@app.route("/")
def index():
    return render_template(
        "index.html",
        products=Product.get_all(),
        counter=Cart.count(),
    )


@app.route("/about")
def about():
    return render_template(
        "about.html",
    )


@app.route("/lazy")
def lazy():
    return render_update("lazy.html")


@app.route("/cart")
def cart_index():
    return render_update(
        "cart/cart.html",
        cart_items=Cart.get_all(),
    )


@app.route("/cart/add", methods=["POST"])
def cart_add():
    product_id = request.args.get("product_id", type=int)
    product = Product.first(id=product_id)
    if not product:
        return ""
    Cart.add(product)
    return render_update(
        "cart/add.html",
        counter=Cart.count(),
    )

@app.route("/cart/remove", methods=["POST"])
def cart_remove():
    product_id = request.args.get("product_id", type=int)
    product = Product.first(id=product_id)
    if not product:
        return ""
    Cart.remove(product)

    return render_update(
        "cart/remove.html",
        counter=Cart.count(),
        cart_items=Cart.get_all(),
    )
