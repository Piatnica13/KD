from flask import Flask
from flask_cors import CORS
from flask_wtf import CSRFProtect
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
from .core.database import db
from .core.config import ProductionConfig
from .core.logging import setup_logging
from .web.admin.admin import admin
from .web.routes.routes import bp_web
from .bot.bot.bot import start_bot
import app.bot.api.api as api
import os

csrf = CSRFProtect()


def create_app() -> Flask:
    app = Flask(__name__, template_folder='./web/templates', static_folder='./web/static')
    
    # Подключение .env файла
    load_dotenv('.password.env')
    app.logger.info("Файл .env загружен.")
    
    
    # Логи (log.py)
    setup_logging(app)
    app.logger.info("Логирование настроено.")
    
    
    # Выбираем конфигурацию по окружению
    app.config.from_object(ProductionConfig)

        
    # Инициализация соединения
    db.init_app(app) 
    app.logger.info("База данных инициализирована.")
    
    
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True
    }

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.logger.info("Настройки базы данных заданы (POSTGRES).")

    # Создание ключа
    app.secret_key = os.getenv("SECRET_KEY")
    app.logger.info(f"Секретный ключ загружен из .env.")

    # Инициализация админ панели
    admin.init_app(app)
    app.logger.info("Админ панель инициализирована.")


    # Cookie Безопасность
    app.config.update(
        SESSION_COOKIE_SECURE=True,      # Только через HTTPS
        SESSION_COOKIE_HTTPONLY=True,    # JS не получит доступ к cookie
        SESSION_COOKIE_SAMESITE='Lax'    # Защита от CSRF
    )
    app.logger.info("Cookie настроено")


    # CSRF Безопасность
    # csrf.init_app(app)
    app.logger.info("CSRF настроено")

    
    # IOS Безопасность
    CORS(app, 
        origins=["https://kodee.kz"],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"])
    
    
    # Регистрация блюпринтов
    app.register_blueprint(blueprint=bp_web)
    app.register_blueprint(blueprint=api.bp_bot)
    
    # Запуск бота
    start_bot(app)
    
    return app

def create_oauth(app: Flask) -> OAuth:
    # OAuth google
    oauth = OAuth(app)

    # Настройка OAuth google
    oauth.register(
        name='google',
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

    app.logger.info(f"OAuth создано")
    return oauth