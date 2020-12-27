from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError


db = SQLAlchemy()


class Base(db.Model):
    __abstract__ = True

    @classmethod
    def create(cls, **attrs):
        obj = cls(**attrs)
        db.session.add(obj)
        db.session.commit()
        return obj

    @classmethod
    def first(cls, **attrs):
        """Returns the first object found with these attributes."""
        return db.session.query(cls).filter_by(**attrs).first()

    @classmethod
    def first_or_create(cls, **attrs):
        """Tries to find a record, and if none exists
        it tries to creates a new one, adding the extra attributes.
        """
        obj = cls.first(**attrs)
        if obj:
            return obj
        return cls.create_or_first(**attrs)

    @classmethod
    def create_or_first(cls, **attrs):
        """Tries to create a new record, and if it fails
        because already exists, return the first it founds."""
        try:
            return cls.create(**attrs)
        except IntegrityError:
            db.session.rollback()
            return cls.first(**attrs)


class Product(Base):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False, default=0)

    @classmethod
    def basequery(cls):
        return db.session.query(cls)

    @classmethod
    def get_all(cls):
        return cls.basequery().order_by(cls.name)


class Cart(Base):
    __tablename__ = "carts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    name = db.Column(db.String, nullable=False, default="")
    price = db.Column(db.Integer, nullable=False, default=0)

    @classmethod
    def basequery(cls, user_id=1):
        return db.session.query(cls)

    @classmethod
    def get_all(cls, user_id=1):
        return cls.basequery(user_id).all()

    @classmethod
    def count(cls, user_id=1):
        return cls.basequery(user_id).count()

    @classmethod
    def add(cls, product, user_id=1):
        item = Cart.first_or_create(
            product_id=product.id,
            user_id=1
        )
        item.name = product.name
        item.price = product.price
        db.session.commit()

    @classmethod
    def remove(cls, product, user_id=1):
        item = Cart.first(product_id=product.id, user_id=1)
        if item:
            db.session.delete(item)
            db.session.commit()


def seed_data():
    db.create_all()
    db.session.add(Product(name="Apple", price="140"))
    db.session.add(Product(name="Pear", price="65"))
    db.session.add(Product(name="Banana", price="90"))
    db.session.commit()
