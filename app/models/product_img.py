from ..core.database import db

class Product_image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num = db.Column(db.Integer)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    img1 = db.Column(db.String(255), nullable=False)
    
    def __init__(self, num: int, product_id: int, img1: str) -> None:
        self.num = num
        self.product_id = product_id
        self.img1 = img1
    
    def __repr__(self) -> str:
        return f"<Image {self.product_id}>"