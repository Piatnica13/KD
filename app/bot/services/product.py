from ...models.product import Product
from ...core.database import db
from telebot import types

class ProductService:
    def get_all(self) -> Product | None:
        return Product.query.all()
    
    def get_by_id(self, id: int) -> Product | None:
        return Product.query.filter_by(id=id).first()
    
    def _change_product_count_core(self, product_id, material, count, markup, app) -> dict[types.InlineKeyboardMarkup, str]:
        with app.app_context():
            product = self.get_by_id(product_id)

            if material == 'gold':
                product.gold += count
            elif material == 'silver':
                product.silver += count
            elif material == 'form_gold':
                product.form_gold += count
            elif material == 'form_silver':
                product.form_silver += count

            db.session.commit()

            text = f"{product.id}. G{product.G} {product.name} \nЗолото: {product.gold}/{product.form_gold}\nСеребро: {product.silver}/{product.form_silver}\n{product.price}₸ {material.upper()}"
            
            markup = markup.change_count_product()

        return {'markup': markup, 'text': text}