from ..services.user import User
from ..services.product import Product
from telebot import TeleBot
from flask import Flask

class NotificationService:
    @staticmethod
    def notify_workers(bot: TeleBot, app: Flask) -> None:
        CRITICAL_LIMIT = 3
        with app.app_context():
            workers = User.query.filter_by(role="worker").all()
            critical_products = Product.query.filter(Product.gold <= CRITICAL_LIMIT).all()
            if not workers or not critical_products:
                return

            text=NotificationService._build_message(critical_products)

            for worker in workers:
                bot.send_message(chat_id=worker.id_tg, text=text)
        
            
    def _build_message(products: Product) -> str:
        result = ['Заканчиваются товары:\n']
        for product in products:
            result.append(
                f"• {product.name}\nЗолото: {product.gold}/{product.form_gold}\nСеребро: {product.silver}/{product.form_silver}\n"
            )
            
        return "\n".join(result)