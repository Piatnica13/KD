from flask_admin import Admin
from ...models.user import User
from ...models.product import Product
from ...models.product_img import Product_image
from ...core.database import db
from .views import UserAdmin, ProductAdmin, ImagesAdmin, MyAdminPanel

admin = Admin(
    name="Kodee Desire Panel",
    index_view=MyAdminPanel()
    )

admin.add_view(UserAdmin(User, db.session))
admin.add_view(ProductAdmin(Product, db.session))
admin.add_view(ImagesAdmin(Product_image, db.session))