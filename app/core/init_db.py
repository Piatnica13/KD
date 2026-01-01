from app import create_app
from app.core.database import db
from app.core.instances import instances_product
from app.web.services.user import UserService
from app.models.user import User
import app.models


def init_db() -> None:
    app = create_app()
    print("DB:", app.config["SQLALCHEMY_DATABASE_URI"])

    with app.app_context():
        db.create_all()
        instances_product(db=db, app=app)
        UserService.add_admin()

    print("✅ Database initialized successfully")

if __name__ == "__main__":
    init_db()