from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False, default=0)

    @classmethod
    def get_all(cls):
        return db.session.query(cls).order_by(cls.name)


class Cart(db.Model):
    __tablename__ = "carts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    @classmethod
    def get_all(cls):
        return db.session.query(cls)


def seed_data():
    db.create_all()
    db.session.add(Product(name="Apple", price="140"))
    db.session.add(Product(name="Pear", price="65"))
    db.session.add(Product(name="Banana", price="90"))
    db.session.commit()
