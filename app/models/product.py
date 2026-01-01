from ..core.database import db
from sqlalchemy.orm import relationship, object_session
from .product_img import Product_image

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    concept = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    descriptions = db.Column(db.String(510), nullable=False)
    slug = db.Column(db.String(100), unique=True)
    images = relationship("Product_image", backref="product", lazy=True, cascade="all, delete-orphan")
    
    name_tg = db.Column(db.String, nullable=False)
    gold = db.Column(db.Integer, nullable=False)
    silver = db.Column(db.Integer, nullable=False)
    form_gold = db.Column(db.Integer, nullable=False)
    form_silver = db.Column(db.Integer, nullable=False)
    G = db.Column(db.Integer, nullable=False)

    def image(self) -> str:
        """Возвращает путь к первому изображению (где num=1) или стандартное"""
        first_image = (
            object_session(self)
            .query(Product_image)
            .filter_by(product_id=self.id, num=1)
            .first()
        )
        return first_image.img1 if first_image else "/static/image/default.jpg"
    
    def __init__(self, name: str, price: int, weight: float, concept: str, category: str, descriptions: str, slug: str, name_tg: str, G: int, gold: int, silver: int, form_gold: int, form_silver: int) -> None:
        self.name = name
        self.price = price
        self.weight = weight
        self.concept = concept
        self.category = category
        self.descriptions = descriptions
        self.slug = slug

        self.name_tg = name_tg
        
        self.gold = gold
        self.silver = silver
        self.form_gold = form_gold
        self.form_silver = form_silver
        self.G = G
        
    def __repr__(self) -> str:
        return f"{self.name_tg}"
