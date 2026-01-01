from flask import session, current_app
from .user import UserService
from ...core.database import db
from ...models.product import Product
from ...models.user import User
from ...models.address import Address
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import cast, String

class ProductService:
    @staticmethod
    def get_user_basket(user):
        
        products = []
        for i in user.basket:
            product = Product.query.filter_by(id=i[0]).first()
            if product:
                products.append(product)
            else:
                current_app.logger.warning(f"Товар с ID {i[0]} из корзины не найден в базе.")
        return products
    
    @staticmethod
    def check_user_for_product_page(slug):
        user_id = session.get('user_id') or ''
        product = Product.query.filter_by(slug=slug).first()

        if user_id != '':
            person = User.query.get(int(user_id))

            address = Address.query.filter_by(user_id=person.id).first()
            current_app.logger.debug(f"Загружена страница продукта '{slug}' пользователем {person.email}")
            return { "product": product,
                    "user": person,
                    "address": address,
                    "favorite": person.favourites}
        else:
            return {"product": product,
                "user": '',
                "address": '',
                "favorite": ''}

    
    @staticmethod
    def add_product_to_basket(data):
        user_name = data.get('user_name')
        
        if user_name != '':
            user = UserService.get_user(session.get("user_id"))
            color = data.get('color')
            size = data.get('size')
            material = data.get('material')
            product_id = data.get('product_id')

            for i in user.basket:
                if product_id == i[0]:
                    current_app.logger.info(f"Товар ID {product_id} уже в корзине пользователя ID {user.id}.")
                    return {"success": False, "error": "Товар уже в <br><a style='color: var(--black)' href='/basket'>корзине</a>"}

            user.basket.append([product_id, color, size, material])

            flag_modified(user, "basket")
            db.session.commit()

            return {"success": True, "message": "Товар успешно добавлен в <br><a style='color: var(--black)' href='/basket'>корзину</a>"}
        else:
            return {"success": False, "error": "Вы не <br><a style='color: var(--black)' href='/login'>авторизованы</a>"}
    
    @staticmethod
    def delete_product_from_basket(user, data):
        old_len = len(user.basket)
        product_id = data.get("product_id")
        
        user.basket = [item for item in user.basket if item[0] != product_id]
        
        db.session.add(user)
        db.session.commit()
        
        new_len = len(user.basket)
        
        if new_len < old_len:
            current_app.logger.info(f"Пользователь ID {user.id} удалил товар ID {product_id} из корзины.")
            return {"success": True, "message": "Товар успешно удален."}
        else:
            current_app.logger.warning(f"Товар ID {product_id} не найден в корзине пользователя ID {user.id}.")
            return {"success": False, "message": "Товар не найден."}
    
    @staticmethod
    def add_or_delete_favorite_product(data):
        user_name = data.get('user_name')
        if user_name != '':
            user = UserService.get_user(session.get("user_id"))
            product_id = data.get("product_id")
            def add_favorite():
                favs = user.favourites
                favs = favs + [product_id]
                user.favourites = favs

                message = "Товар добавлен в избранные"
                current_app.logger.info(f"Товар ID {product_id} добавлен в избранное пользователя ID {user.id}.")
                return message

            def delete_favorite():
                user.favourites = [pid for pid in user.favourites if pid != product_id]
                message = "Товар удален из избранных"
                current_app.logger.info(f"Товар ID {product_id} удалён из избранного пользователя ID {user.id}.")
                return message

            result = delete_favorite() if product_id in user.favourites else add_favorite()

            db.session.add(user)
            db.session.commit()

            return {"success": True, "message": result}
        else:
            return {"success": False, "error": "Вы не <br><a style='color: var(--black)' href='/login'>авторизованы</a>"}
    
    @staticmethod
    def trans_products_to_JS():
        all_products = Product.query.all()

        product_list = []
        for product in all_products:
            product_list.append({
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "concept": product.concept,
                "category": product.category,
                "slug": product.slug,
                "image": f"/static/image/productImgs/{product.slug}/img1.webp"
            })

        return product_list
    
    @staticmethod
    def search_product(data):
        query = data.get("query", "").strip()
        if not query:
            current_app.logger.debug("Пустой поисковый запрос.")
            return []

        products = Product.query.filter(
            (cast(Product.id, String).ilike(f"%{query}%")) |
            (Product.name.ilike(f"%{query.capitalize()}%"))
        ).limit(10).all()

        current_app.logger.info(f"Найдено {len(products)} товаров по запросу '{query}'.")

        results = [{
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "slug": p.slug,
            "image": p.image()
        } for p in products]
        
        return results
    
    @staticmethod
    def get_products_for_properties():
        products = Product.query.limit(4).all()
        products_json = []
        for p in products:
            products_json.append({
                "@type": "Product",
                "name": p.name,
                "image": p.image(),
                "description": p.descriptions,
                "brand": {
                    "@type": "Brand",
                    "name": "KoDee Desire"
                },
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "KZT",
                    "price": p.price,
                    "availability": "https://schema.org/InStock"
                }
            })
        return products_json
    
    @staticmethod
    def add_imgs_for_product(data_files, data_form):
        from slugify import slugify
        import os

        try:
            name = slugify(data_form.get('productName'))
            base_path = os.path.join(current_app.root_path, 'static', 'image', 'productImgs', name)

            os.makedirs(base_path, exist_ok=True)

            img1 = data_files.get('img1')
            img2 = data_files.get('img2')
            img3 = data_files.get('img3')
            img4 = data_files.get('img4')

            if img1:
                img1.save(os.path.join(base_path, "img1.webp"))
            if img2:
                img2.save(os.path.join(base_path, "img2.webp"))
            if img3:
                img3.save(os.path.join(base_path, "img3.webp"))
            if img4:
                img4.save(os.path.join(base_path, "img4.webp"))

            current_app.logger.info(f"Файлы {img1} {img2} {img3} {img4} успешно добавлены в папку {base_path}")
            return {"status": "ok"}
        except Exception as e:
            return {'error': f"Ошибка с файлами {e}"}
        
    @staticmethod
    def get_product():
        products = Product.query.all()
        product_data = [
            {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "concept": p.concept,
            "category": p.category,
            "image": p.image(),
            "slug": p.slug
            }
            for p in products
        ]
        return product_data